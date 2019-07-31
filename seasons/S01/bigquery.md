# Big Query

Siguiendo con el almacenamiento, veamos esta maravillosa Base de Datos, Big Query es una Base de Datos SQL destinada a analítica, capaz de procesar PB de datos de muy rápidamente, ya que procesa de forma distribuida en miles de workers un pedacito de los datos, de este modo las consultas se ejecutan muy rápidamente.
Si quieres conocerla mejor acá te dejo un link a la [descripción oficial](https://cloud.google.com/bigquery/), de seguro vas a amar esta Base de Datos.
Dentro de las cosas interesantes con las que cuenta GCP y que nos ayudará en nuestra búsqueda de la economía, se encuentra la posibilidad de exportar todos los datos de facturación y uso de cada uno de los productos y servicios a Big Query de forma automática y periódica. 
Para poder hacerlo primero debes es crear un Dataset.

```sh
#Creamos el dataset
bq --location=US mk --dataset --description "Dataset principal de billing" ${TU_PROYECTO}:billing_export
```

A continuación en tu consola web debes realizar los sieguientes pasos: 
1) Billing/Billing Export 
2) Crea una exportación de Billing
3) Selecciona el proyecto donde esta el Dataset que acabamos de crear

En esta exportación automática podremos tener una vista más exacta del uso de cada componentes o servicio en GCP, en el [Capítulo 3](/costos-bajo-control-bigquery-Datastudio.md) veremos como crear un Dashboard en Data Studio para visualizar el Billing.

Hasta aquí todo bien con Big Query, pero hablemos de dinero, veamos qué nos ofrece GCP para esta Base de Datos en su capa gratuita.

![](/images/chapter-1/cloud_bigquery_limits.png)

Como vemos los primeros 10 GB cada mes son gratuitos, esto es bastante, ahora bien recuerda que Big Query también cobra por los GB que debes mover para hacer cada consulta, para ello la capa gratuita nos da 1 TB en querys sin costo.
Y cómo vemos en la tabla hay algunos conceptos asociados a ML (Machine Learning) que también tenemos gratis. ☺

