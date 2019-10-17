# Vigila el uso de la capa gratuita desde Data Studio

Como ya hemos visto en los [articulos anteriores](/seasons/S00/README.md) podemos sacar mucho provecho a la capa gratuita de Google Clouda Platform, pero hacerlo a ciegas es muy peligros y no nos da espacio para la optimizacion. Por eso en este articulo veremos como sacar más provecho a la __exportación de Billing hacia Big Query__, construir una schedule query para procesar esos datos y finalmente clonar un Dashboard  de Data Studio para la visualizacion del uso de la capa gratuita.

## Administración del Billing

Como ya sabras los costos son unos de los pilares de la nube, y en el caso de Google Cloud tenemos control absoluto de estos, para ello tenemos a nuestra disposición la exportación de Billing hacia [Bigquery](/seasons/S01/bigquery.md), esto incluye todos y cada uno de los gastos que se realizan dentro de la platafora asociados a un mismo Billing ID. 

Esto quiere decir que tendremos una tabla en bigquery que recibira cada uno de los eventos que produczcan un gasto de cada uno de los productos que estes utilizando. Si tomamos como ejemplo clud run, cada uno de los request, uso de CPU, memoria, red entre otros,seran regitados en la base de datos junto con el costo de cada concepto.

A continuación un pequeño ejemplo de los aspectos recopilados para este producto.


```SQL
SELECT 
    service.id as service_id,	
    service.description as service_description,	
    sku.id as sku_id,	
    sku.description as sku_description,
    count (1) events
FROM `<PROJECT_ID>.<SCHEMA_ID>.gcp_billing_export_v1_<BILLING_ID>` 
WHERE DATE(_PARTITIONTIME) = "2019-10-07" 
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

Esta funcionalidad no viene activada por defecto para tus proyectos en Google Cloud y basta con que lo realices solamente una vez y de alguno de tus proyectos en el que cuentes con permisos de Billing en IAM.

Para habilitar la exportacion haci Bigquery lo primero que debes hacer es crear un Dataset en bigquery, podrías hacer por interfaz gráfica pero es más rápido con un comando.

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


Listo, ya esta configurado, a partir de ahora cada accion dentro de la plataforma será registrada en la base de datos y podremos saber con certeza cuanto se esta gastando en cada uno de los productos que tenemos corriendo en todos nuestros proyectos.

Ahora veremos como crear un Dashboard en Datastudio para analizar esos datos, lo que debes tener en cuenta es que los datos se registrarán recien a partir de la configuracion de la exportacion y para que el dashboard muestre informacion deben exisitir componentes creados como, ya sea cloud functions, storage, compute engine, es decir puedes crear cualquier componente de la capa gratuita y generar uso para verlo reflejado en los registros de Bigquery.

## Preparando los datos para el Dashboard

Ya que tenemos habilitada la exportación de billing tenemos mejor visibilidad de que ocurre con nuestros servicios corriendo en GCP, sin embargo esto tambien podría tener repercuciones en los costos, ya que la tábla de exportacion de billing seguirá creciendo para siempre, por lo tanto, debemos crear una tabla con los datos pre procesados para el Dashboard, de esta forma las queries serán más economicas al realizarlas sobre un conjunto menor de datos, los cules ya estan agrupados y contiene solo lo que el reporte necesita.

La mejor forma de hacerlo es con una Schedule Query, que se ejecute una vez al día, para hacerlo debes seguir estos pasos.

Toma esta query y llevala a Bigquery 

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
A partir de esta consulta crearemos el schedule diario, para ello, dale click al boton "Schedule Query" y luego a "Create Schedule Query" luego ingresa los valores que se muestran en la siguente imagen


![Configurar Schedule Query](/images/S02/configure_schedule_query.png)

## Manos a la obra con Data Studio

Data Studio es una una herramienta de reporting muy versatil, capaz de conectarse con múltiples orígens de datos, y en este caso su conexion con Bigquery es nativa.

A fin de tener tu propia copia del dashboard, debes entrar a [este reporte](https://datastudio.google.com/s/pj6gCfLTuGA) y seguir las instrucciones de copiado, que se encuentran en la última página.



https://www.qwiklabs.com/quests/97?linkId=75174083

