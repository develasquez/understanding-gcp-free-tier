# Vigila el uso de la capa gratuita desde Data Studio

Como ya hemos visto en los [articulos anteriores](/seasons/S00/README.md) podemos sacar mucho provecho a la capa gratuita de Google Cloud Platform, pero hacerlo a ciegas es muy peligros y no nos da espacio para la optimización. Por eso en este articulo veremos como sacar más provecho a la __exportación de Billing hacia BigQuery__, construiremos una schedule query para procesar esos datos y finalmente clonaremos un Dashboard de Data Studio para la visualizacion de nuestro costos y tener bajo control el uso de la capa gratuita.

## Administración del Billing

Como ya sabras, los costos son unos de los pilares de la nube y en el caso de Google Cloud tenemos control absoluto de estos, para ello se encuentra a nuestra disposición la exportación de Billing hacia [BigQuery](/seasons/S01/bigquery.md), esto incluye todos y cada uno de los gastos que se realizan dentro de la platafora asociados a un mismo Billing ID. 

Esto quiere decir que tendremos una tabla en bigquery que recibira cada uno de los eventos que produzcan un gasto, de cada uno de los productos o servicios que estes utilizando dentro de GCP. Si tomamos como ejemplo Cloud Run, cada request, uso de CPU, memoria, red, entre otros, seran regitados en la base de datos junto con el costo asociado a su uso.

A continuación un pequeño ejemplo de los aspectos recopilados para Cloud Run. Si no puedes ejecutar esta query no te angusties más adelante en el articulo veremos como. 


```SQL
SELECT 
    service.id as service_id,	
    service.description as service_description,	
    sku.id as sku_id,	
    sku.description as sku_description,
    count (1) events
FROM `<PROJECT_ID>.<SCHEMA_ID>.gcp_billing_export_v1_<BILLING_ID>` 
WHERE DATE(_PARTITIONTIME) = "2019-12-02" 
    AND service.description = "Cloud Run"
group by billing_account_id,
    service.id,
    service.description,	
    sku.id,	
    sku.description	
```
El resultado de la query luce como este

![Resultado Query Billing 1](/images/S02/resultado_query_billing_1.png)


## Habilitando la exportación de Billing

Esta funcionalidad no viene activada por defecto para tus proyectos en Google Cloud y basta con que lo realices solamente una vez y dedesde alguno de tus proyectos en el que cuentes con permisos de Billing en IAM.

Para que la mágia ocurra y por fin tener habilitada la exportacion hacia BigQuery lo primero que debes hacer es crear un Dataset en bigquery, lo podrías hacer por interfaz gráfica pero es más rápido con un comando.

```sh
#Creamos el dataset
bq --location=US mk --dataset --description "Dataset principal de billing" ${PROJECT_ID}:free_tier_dashboard
```

A continuación en tu consola web debes realizar los sieguientes pasos:

1) Billing/Billing Export
2) Crea una exportación de Billing
3) Selecciona el proyecto donde esta el Dataset que acabamos de crear

La siguiente imágen lo aclara todo...

![Habilitar Exportación](/images/S02/export.png)


Listo, ya esta configurado, a partir de ahora cada acción dentro de la plataforma será registrada en la base de datos y podremos saber con certeza cuanto se esta gastando en cada uno de los productos que tenemos corriendo a lo largo de todos nuestros proyectos.

Ahora veremos como crear un Dashboard en Datastudio para analizar esos datos, lo que debes tener en cuenta es que los datos se registrarán solo despues de que realices configuracion de la exportacion y para que el dashboard muestre informacion deben exisitir componentes creados, ya sea Cloud Functions, Storage, Compute Engine, entre otros, es decir puedes crear cualquier componente de la capa gratuita y generar uso para verlo reflejado en los registros de BigQuery.

## Preparando los datos para el Dashboard

Ya que tenemos habilitada la exportación de billing, tenemos mejor visibilidad de lo que ocurre con nuestros servicios corriendo en GCP, sin embargo esto tambien podría tener repercuciones en los costos, ya que la tábla de exportacion de billing seguirá creciendo para siempre, por lo tanto, debemos crear una tabla con los datos pre procesados para el Dashboard, de esta forma las queries serán más economicas al realizarlas sobre un conjunto menor de datos, los cules ya estan agrupados y contiene solo lo que el reporte necesita.

La mejor forma de hacerlo es con una Schedule Query, que se ejecute una vez al día, para hacerlo debes seguir estos pasos.

Toma esta query y llevala a BigQuery 

```SQL
SELECT
  IFNULL(project.id, "No Project") AS porject_id,
  IFNULL(service.description, "No Service Description") AS service_description,
  IFNULL(sku.description, "No SKU Description") AS sku_desciption,
  IFNULL(invoice.month, "No Invoice Month") AS invoice_month,
  IFNULL(CASE
      WHEN usage.unit = "bytes" THEN "GB"
      WHEN usage.unit = "seconds" THEN "Hrs"
      WHEN usage.unit = "byte-seconds" THEN "GB-Month"
  END, "No Usage Unit")AS usage_unit,
  IFNULL(location.location, "No Location") AS location_location,
  SUM(IFNULL(CASE
        WHEN usage.unit = "bytes" THEN IFNULL(usage.amount, 0)/1073741824
        WHEN usage.unit = "seconds" THEN IFNULL(usage.amount, 0)/3600
        WHEN usage.unit = "byte-seconds" THEN IFNULL(usage.amount, 0)/720000576000000
      ELSE IFNULL(usage.amount,0)
    END, 0)) AS usage_amount,
  SUM(IFNULL(usage.amount_in_pricing_units, 0)) AS usage_amount_in_pricing_units,
  _PARTITIONTIME AS export_time, SUM(IFNULL(cost, 0)) AS cost,
  SUM(IFNULL(( SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS credits,
  SUM(IFNULL(cost, 0)) + SUM(IFNULL(( SELECT SUM(c.amount) FROM UNNEST(credits) c), 0)) AS final_cost
FROM
  `<PROJECT_ID>.<SCHEMA_ID>.gcp_billing_export_v1_<BILLING_ID>`
GROUP BY
  project.id,
  service.description,
  sku.description,
  invoice.month,
  usage.unit,
  location.country,
  location.location,
  _PARTITIONTIME
```
A partir de esta consulta crearemos el schedule diario, para ello, dale click al boton "Schedule Query" y luego a "Create Schedule Query",a continuación ingresa los valores que se muestran en la siguente imagen.


![Configurar Schedule Query](/images/S02/configure_schedule_query.png)

## Manos a la obra con Data Studio

Data Studio es una una herramienta de reporting muy versatil, capaz de conectarse con múltiples orígens de datos, y en este caso su conexion con Bigquery es nativa.

Para tener tu propia copia del dashboard, debes entrar a [este reporte](https://datastudio.google.com/s/pj6gCfLTuGA) y seguir las instrucciones de copiado, que se encuentran en la última página.


![Pasos para copiar](/images/S02/copy_dashboard.png)

## Conozcamos el Dashboard

En este Dashboard encontrarás 7 páginas con la informacion de los costos consumidos por tu cuenta de facturación en Google Cloud, recuerda que para que el dashboard tenga datos tienes que haber realizado el proceso anterior de copia y apuntarlo a tu dataset.

![All Products Cost](/images/S02/all_products.png)

* __All Products Cost__: Este es un cuadro general con los costos por proyecto, por ubicación geográfica, que es muy importante para la capa gratuita y por cada uno de los servicio que estas utilizando entre todos tus proyectos. Los valores presentados representan el monto estimado a pagar por los servicios en el rango de tiempo selecciondo, por defecto se presenta el mes en curso.

* __Compute Engine__: Si bien no vimos un articulo asociado a Compute Engine, este servicio tiene mucha utilidad en la capa gratuita, y merece su propia página en el Dashboard. Esta página presenta un detalle de los unbrales para la capa gratuita de GCE, en la cabecera te encontrarás con la cantidad de __horas__, __GB de disco/mes__, __GB de salida de la red__ y los cosotos estimados a pagar. Junto con lo anterior encontrarás el detalle de los SKU (Articulos o productos que componen un servicio), las ubicaciones donde estan despelegadas las VMs y los servicos expresados en un gráfico de torta para ver los que mas gasto generan.

* __App Engine__: Uno de los más completos servicios serverless en GCP es App Engine y claro, cuenta con una capa da uso gratuito y por eso tiene su lugar en el Dashboard, En este reporte encontrarás un detalle de los aspectos que involucra la capa gratuita para App engine, una cabecera con la cantidad de __horasde Front End__, __GB almacenamiento__, __GB de salida de la red__ y los cosotos estimados a pagar. Junto con lo anterior encontrarás el detalle de los SKU  y los servicos expresados en un gráfico de torta para ver los que mas gasto generan.

* __Cloud Functions__: Este servicio los vimos en este [articulo](https://medium.com/@felipe.velasquezc/entendiendo-la-capa-gratuita-de-gcp-cloud-functions-1644864529ec) y por supuesto tiene su página en el Dashboard. Aquí encontramos un detalle de los aspectos que involucra la capa gratuita para cloud functions, una cabecera con la cantidad de __requests__, __Horas de CPU__, __GB de salida de la red__ y los cosotos estimados a pagar. También verás un detalle de los SKU y un gráfico de linea que muestra la cantidad de requests, cpu y red para el periodo seleccionado, por defecto verás los request por día del mes en curso.

* __Cloud Run__: Este nuevo servicio tambien tiene su propio [articulo](https://medium.com/@felipe.velasquezc/entendiendo-la-capa-gratuita-de-gcp-cloud-run-55021a30563f) que te ayudara a sabar el máximo provecho a la capa gratuita Aquí encontramos un detalle de los aspectos que involucra la capa gratuita para cloud run junto con la cabecera que detalla la cantidad de __requests__, __Horas de CPU__, __GB de salida de la red__ y los cosotos estimados a pagar. También verás un detalle de los SKU y un gráfico de linea que muestra la cantidad de requests, cpu y red para el periodo seleccionado, por defecto verás los request por día del mes en curso.

![Cloud Run](/images/S02/run.png)

* __Cloud Storage__: Si quieres ver como optimizar el uso de GCS te recomiendo ver este [articulo](https://medium.com/@felipe.velasquezc/entendiendo-la-capa-gratuita-de-gcp-cloud-storage-f7a806b2932f), Por otra parte en el Dashboard se presentan los aspectos que involucra la capa gratuita para GCS, la cabecera entrega información relativa a la cantidad de  __GB/mes__, __GB de salida de la red__ y los cosotos estimados a pagar. Verás el detalle los SKU involucrados, las ubicaciones donde estan despelegadas las VMs y los servicos expresados en un gráfico de torta para ver los que mas gasto generan.
* __Other Services__: Esta página del Dashboard concentra otros servicios incluidos en la capa gratuia, de los cuales [BigQuery](https://medium.com/@felipe.velasquezc/entendiendo-la-capa-gratuita-de-gcp-bigquery-71c3c661e3c4) y [Pub/Sub](https://medium.com/@felipe.velasquezc/entendiendo-la-capa-gratuita-de-gcp-cloud-run-55021a30563f) tiene tambien su propio articulo. Tambien podras encontra iformación del uso de Cloud Build

## El Billing es una ciencia 

Despues de una serie de 7 articulos hablando de costos es probable que creas que ya no hay nada que saber, sin embargos esto han dado solo una pincelada de lo que es realmente el manejo de costos dentro de GCP, aun queda mucho por ver y aprender. Y por eso te recomiendo que hagas estos Qwiklabs que llevan por titulo "Optimizing Your GCP Costs" [https://www.qwiklabs.com/quests/97](https://www.qwiklabs.com/quests/97) 

