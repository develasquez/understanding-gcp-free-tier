# Entendiendo la capa gratuita de GCP
## Capítulo 1 - Productos, Características y Umbrales de la capa gratuita

La adopción de Google Cloud Platform está creciendo mucho y ya forma parte del stack con el que se están construyendo las soluciones de muchas empresas en Latinoamérica. Es por esto que muchos de nosotros estamos deseosos de implementar nuestros proyectos personales, pruebas de concepto e inclusos nuestros emprendimientos en la nube Google.
Ahora bien, en la mayoría de los casos no contamos con el $presupuesto$ para dar el primer paso. Así que en este artículo te voy a contar cómo sacar el máximo provecho a la capa "Always Free" de GCP y por supuesto ver cómo [Cloud Run](https://cloud.google.com/run/) hace todo más fácil.

## Always Free

No hay nada mejor en la vida que las cosas gratis y Google Cloud lo sabe, por lo tanto, en su búsqueda de nuevos adeptos tiene un excelente plan de iniciación, el cual incluye USD 300 por 12 meses y junto con esto una gran cantidad de productos de los cuales una determinada porción de su uso no tiene costo. Esta es la denominada capa __Always Free__, que en palabras de Google __"Puedes utilizar estos productos sin coste alguno hasta que alcances los límites de uso especificados, durante la prueba gratuita y cuando esta finalice. Estos límites no caducan, pero están sujetos a cambios"__. Primero, entenderemos cómo se cobra cada servicio entre todos los proyectos, y luego revisaremos algunos de los productos emblemáticos incluidos en esta capa gratuita, para finalmente ver un ejemplo de cómo tener una arquitectura completa que tiene una facturación mensual de cero (así es, leíste bien, una factura mensual de cero!).

## Costos

Hablemos de plata: para entender cómo funciona el cobro de productos en GCP pongamos como ejemplo las [Google Cloud Functions](https://cloud.google.com/functions/) (que igualmente profundizaremos más adelante). Este producto incluye __2 millones de ejecuciones gratis__, sin embargo, esto se compone de __*todas*__ las Cloud Functions que puedas tener creadas dentro de __*todos*__ tus proyectos asociados a una cuenta de Billing.

_*OJO*_

Lo anterior quiere decir que si tienes __3 proyectos__ con __5 Cloud Functions__ cada uno, debes tratar que entre esas __*15 funciones*__ no se pasen de los __2 millones__ de ejecuciones, si tu intención es que salga $0 a fin de mes. Además, debes tener presente que esto aplica a todos los productos de GCP:

> La capa gratuita considera el uso total del producto __entre todos los proyectos__

El cobro por el uso de cada producto se compone de múltiples factores. Continuemos con el ejemplo de las Cloud Functions: este producto se cobra tanto por *número de ejecuciones*, por *uso de la red de entrada y salida*, el *tamaño de la RAM* y *CPU* asignadas, así como por *el tiempo de CPU total utilizado* en la ejecución de cada función. Veamos un ejemplo:

![](/images/chapter-1/cloud_functions_ejemplo1.png)

En la imagen anterior, podemos ver una Cloud Function que se ejecuta sólo *1 millón de veces por mes*, el tamaño del payload es regular (*2.5 kb*), pero su tiempo de ejecución es de *30 segundos* por cada llamada: como verás en la siguiente imagen, el costo mensual se dispara a __USD 66__.

![](/images/chapter-1/cloud_functions_ejemplo2.png)

Este ejemplo nos recuerda lo cautelosos que debemos ser al utilizar cada servicio: conocer sus umbrales y en especial tener en cuenta __para qué fue creado cada producto__. Siguiendo nuestro ejemplo de Cloud Functions, si vamos a enfrentar más de 30 segundos de procesamiento por cada llamada, entonces claramente Cloud Functions __no es la herramienta idónea__ (para nuestro propósito de gastar lo menos posible). En este escenario, debemos considerar algún servicio que __no__ tenga una estructura de cobro por ejecución. Sólo como referencia de las posibilidades que hay, en [Google Compute Engine](https://cloud.google.com/compute/) USD 24,75 mensuales por 730 horas de ejecución continua de una instancia *n1-standard-1* ó USD 0 (sí, cero!) con una *f1-micro*.

Ahora que tenemos claro cómo se factura el uso de los servicios en GCP vamos a dar un vistazo a los principales productos y los límites que comprenden su capa gratuita.

## Productos y sus Límites

Ahora veamos algunos productos más detalladamente, sus características principales, su cuota gratuita y cómo debes usarlo para no pasarte de los límites.

### Cloud Functions

Ya que lo utilizamos en el ejemplo anterior, serán las primeras en nuestra revisión (este es uno de mis componentes favoritos, por su simplicidad y versatilidad). 

Para los que no lo conocen, [Google Cloud Functions](https://cloud.google.com/functions/) es uno de los productos [serverless](https://cloud.google.com/serverless/) de GCP, y nos permite ejecutar una función específica sin la necesidad de preocuparnos de lo demás temas (como dónde se ejecuta la función, por ejemplo). Si quieres conocerla mejor [puedes ver esta charla](https://www.youtube.com/watch?v=4IewxFRGUko) que dimos con [Iván Olivares Rojas](https://medium.com/u/62f5f65fb29b) en las oficinas de [Globant](https://medium.com/u/9a82c850e61f) Chile.

Básicamente, con Cloud Functions te olvidas de todo lo que ves en la siguiente imagen: 

![](/images/chapter-1/cloud_functions_explanation1.png)

y pasas a un esquema donde te enfocas exclusivamente al código *desde tu función en adelante*; Google Cloud crea y administra todo el resto de componentes requeridos para la solución, por ti:

![](/images/chapter-1/cloud_functions_explanation2.png)

Cloud Functions puede ser activado de múltiples formas, las más conocidas son *invocación por pedidos HTTP*, *eventos generados en Cloud Storage* y *mensajes gatillados en un tópico de Pub/Sub*, sin embargo tiene muchos más: te invito a verlos en [este link](https://cloud.google.com/functions/docs/calling/).

En lo que respecta a la capa gratuita encontramos los siguientes umbrales:

![](/images/chapter-1/cloud_functions_free_tier_limits.png)

Esto significa que, de forma combinada, entre __*todas*__ las Cloud Functions de __*todos*__ tus proyectos, __si no sobrepasas esos límites, no pagarás por tener cargas de trabajo desplegadas en Cloud Functions__. 

Recuerda, tal como vimos en el ejemplo introductorio, para que la facturación sea $0 debes tener en cuenta los siguientes valores promedio de tus Cloud Functions:

![For Free](/images/chapter-1/cloud_functions_free_tier_limits_calc.png)

No hay restricciones respecto a la cantidad de Cloud Functions: puedes tener las que quieras repartidas en todos tus proyectos. Lo importante es que consideres que para el umbral gratuito, se considera la suma entre todas las que existan bajo tu cuenta.

### Cloud Pub/Sub

Otro servicio icono de GCP es [Cloud Pub/Sub](https://cloud.google.com/pubsub/), este es un servicio full administrado de mensajería, fundamental para tus arquitecturas basadas en eventos, ya que puedes definir un tópico y asociados a este, tener tanto publicadores de mensajes, cómo suscriptores interesados en los mensajes de dicho tópico.

Pub/Sub al ser full administrado por Google escala según la necesidad de forma automática y tiene una muy alta performance.

Puedes conectarlo de forma nativa a múltiples productos de GCP entre los más significativos para nuestros escasos recursos son Cloud Functions y las alertas de Billing.

![Pub/Sub](/images/chapter-1/cloud_pub_sub_image1.png)

Sin lugar a dudas querrás tener tópicos de Pub/Sub  en tu infraestructura pero debes tener presente cuales son los umbrales considerados dentro de la capa gratuita y cuanto pagarás si te pasas.

La capara gratuita de Pub/Sub contempla los __10 primeros GB gratis__, luego de eso deberás pagar 60 USD por cada TB y [entre más TB uses más barato será](https://cloud.google.com/pubsub/pricing). Esto quiere decir que tenemos 10 GB de transferencia y hasta 10.000 tópicos que podemos utilizar gratis todos los meses, si quieres más info aquí te dejo el link a las [cuotas y límites](https://cloud.google.com/pubsub/quotas).


### Cloud Storage


Otro servicio fundamental en toda infraestructura es el de Almacenamiento de archivos, para ello contamos con Google Cloud Storage, este servicios nos brinda múltiples opciones de almacenamiento ya sea a nivel __Multi Regional__, es decir, tus archivos se replican en múltiples locaciones, lo que mejora el acceso y la disponibilidad ante desastres, __Regional__, que almacena tus archivos en una sola región, __Near Line__, que tiene menos costo de almacenamiento con la condición de acceder a tus archivo nos más de una vez al mes y __Cold Line__, que es el más económico de los tipos de almacenamiento, ya que se espera que accedas a tus archivo máximo una vez al año.

En la imagen a continuación tienes algunos de los posibles usos de GCS en tus arquitecturas y la posibilidad de integración con otros servicios de Google Cloud Platform

![Caso de uso Cloud Storage](/images/chapter-1/cloud_storage_diagram.png)

Hay múltiples formas de ahorrar en el uso de Cloud Storage, entre las principales están, el tener claro la cantidad de GB que serán almacenados cada mes, el nivel de replicación que los archivo tendrán, la cantidad de veces que serán accedidos y el tiempo que duren los archivos almacenados.

Veamos los costos del servicios, cuales son los límites y qué operaciones incluye la capa gratuita.

![](/images/chapter-1/cloud_storage_limits.png)


Por lo tanto, tenemos __5GB en Storage Regional__, lo que es un _warning_ importante ya que los storages se crean automáticamente cómo Múlti Regional, así que cuando crees un Bucket debes usar el siguiente comando para que su uso se considere en la capa gratuita al crearlo solo como Regional.

```sh
gsutil mb -c regional -l us-central1 gs://<BUCKET_NAME>/
```

En lo que respecta a las operaciones, son estas:

__Clase A__: Añadir objetos y enumerar segmentos y objetos
__Clase B__: Obtener objetos y visualizar metadatos de segmentos y objetos

Otro aspecto a considerar es el uso de la red, ya que si bien podemos almacenar 5GB, __sólo tendremos 1GB de salida__ desde USA gratis.


### Big Query

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

### Cloud Run

Pasemos ahora a la jugador más valioso, Cloud Run, este es uno de los nuevos servicios de computo de GCP y una más de las herramientas Serverless de la plataforma.
Cloud Run nos permitirá


