# Vigila el uso de la capa gratuita desde Data Studio

Como ya hemos visto en los [articulos anteriores](/seasons/S00/README.md) podemos sacar mucho provecho a la capa gratuita de Google Clouda Platform, pero hacerlo a ciegas es muy peligros y no nos da espacio para la optimizacion. Por eso en este articulo veremos como sacar más provecho a la __exportación de Billing hacia Big Query__, construir una schedule query para procesar esos datos y finalmente clonar un Dashboard  de Data Studio para la visualizacion del uso de la capa gratuita.

## Administracion del Billing

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

![Resultado Query Billing 1](/images/S03/resultado_query_billing_1.png)

## Habilitando la exportación de Billing

Esta funcionalidad no viene activada por defecto para tus proyectos en Google Cloud y basta con que lo realices solamente una vez y de alguno de tus proyectos en el que cuentes con permisos de Billing en IAM.

Para habilitar la exportacion haci Bigquery lo primero que debes hacer es crear un Dataset en bigquery, podrías hacer por interfaz gráfica pero es más rápido con un comando.

```sh
#Creamos el dataset
bq --location=US mk --dataset --description "Dataset principal de billing" ${PROJECT_ID}:billing_export
```

A continuación en tu consola web debes realizar los sieguientes pasos:
1) Billing/Billing Export
2) Crea una exportación de Billing
3) Selecciona el proyecto donde esta el Dataset que acabamos de crear




Y listo, ya esta configurado, a partir de ahora cada accion dentro de la plataforma será registrada en la base de datos y podremos saber con certeza cuanto se esta gastando en cada uno de los productos que tenemos corriendo en todos nuestros proyectos.

Ahora veremos como crear un Dashboard en Datastudio para analizar esos datos, lo que debes tener en cuenta es que los datos se registrarán recien a partir de la configuracion de la exportacion y para que el dashboard muestre informacion deben exisitir componentes creados como, ya sea cloud functions, storage, compute engine, es decir puedes crear cualquier componente de la capa gratuita y generar uso para verlo reflejado en los registros de Bigquery.


