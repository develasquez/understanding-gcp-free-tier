# Cloud Run

Continuando con los servicios de GCP que nos permitirán optimizar nuestro gasto en infraestructura esta tu mejor amigo, Cloud Run, este es un servicio full administrado para la ejecución de contenedores. Capaz de hacerse cargo de tu aplicación ento todos los aspectos.

Cloud Run permite desde una imágen Docker, ejecutar un contenedor en modalidad serverless caaz de escalar desde cero a la cantidad de instancias necesarias para satisfacer la demanda de tu servicio.

Dentro de las últimas [noticias](https://cloud.google.com/run/docs/release-notes) que nos dio el Cloud Next en Londres es que Cloud Run paso de Beta a GA (General Availability)

## Cloud Run y la Capa Gratuita

En tehoría podriamos decir que Cloud Run tiene componentes en la capa [gratuita de GCP](https://cloud.google.com/run/pricing), sin embargo si lo utilizamos en Latino America no podreamos hacer excentos de pago, veamos por que.


![Run Pricing](/images/S01/cloud_run/pricing.png)

Como vemos en la imagen anterior Cloud Run cuenta con todos los componentes necesarios para operar de forma completamente gratuita, sin embargo en lo que respecta Networking presenta una limitancia ya que solo cuenta con __1GB__ de salida de datos hacia Norte America. Por lo tanto si nuestros clientes estan en cualquier otro lugar tendremos que pagar aun que son solo moneditas (_0,105 USD/GB_)

Otro aspecto importante a considera en cuanto al tiempo de uso de CPU del cual los primeros 180.000 segundos son gratuitos, debemos tener en cuenta que siempre redondeará hacia arriba a los proximos 100 milisegundos.

Junto con lo anterior es importante saber la forma en la que se caclulan los segundos de computo, ya que si tu instancia estaba escalada a 0 y llega un request esta se inicia y comienza a cobrar hasta que s resuelva el request, sin embargo, si durante el procesamiento del primer request se inicia un segundo request el tiempo de procesamiento que se cobrará sera en total desde que se inicio el primer request hasta que termino de procesar el segundo.


![billable time](/images/S01/cloud_run/billable-time.svg)

## Uso de otros servicios

Para usar Cloud Run de forma óptima es necesario utilizar otros servicios de GCP los cuales tienes su propia capa gratuita y límites.

### Google Cloud Build

Ya que Cloud Run trabaja con imágenes Docker es neceasario hacer el build de tu Dockerfile y tu código y para esto Cloud Build te da __120 minutos__ mensuales de contrucción de imágenes, una vez creada la imágen Cloud Build puede depositarla en Cloud Container Registry.

### Cloud Container Registry

Para realizar el despliegue de un servicio en Cloud Run es necesario elegir una de las imagenes que se encuentran en Cloud Container Registry, el costo de este servicio esta dado por el uso de almacenamiento en Google Cloud Storage de la imagenes almacenadas. Por lo tanto recuerda que para que GCS sea sin costo solo tienes 5GB de storage regional. Por lo tanto te recomiendo que uses un Container Registry Regional como __us.gcr.io__, del cual segun la [documentacion](https://cloud.google.com/run/pricing) el despliegue en regiones dentro de __us__ es sin costo.


### Cloud DNS

La capacidad de asociar un dominio o subdominio en un par de click a uno de nuestros servicios en Cloud Run es una de la caracteristicas más llamativas, sin embargo esta caracteristica no forma parte de la capa gratuita sino que se basa en los costos de __Cloud DNS__ los que puedes ver [aquí](https://cloud.google.com/dns/pricing), los cuales rondan los USD $0.40 por millon de request, si que el impacto en los costos debería ser infimo.

Hasta qui con Cloud Run, no sin lugar a dudas la versatilidad de este servicio lo volverá tu mejor amigo y siempre es bueno saber a que costos te efrentas al ustilizar este moravilloso servicio.



