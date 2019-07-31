# Cloud Pub/Sub

## Características principales

Otro servicio ícono de GCP es [Cloud Pub/Sub](https://cloud.google.com/pubsub/): es un servicio full administrado de mensajería, fundamental para tus [_arquitecturas basadas en eventos_](https://es.wikipedia.org/wiki/Arquitectura_dirigida_por_eventos), ya que puedes definir un _tópico_ y asociados a este, tener tanto _publicadores de mensajes_, como _suscriptores_ interesados en los mensajes de dicho tópico.

Pub/Sub al ser full administrado por Google escala según la necesidad de forma automática, y tiene una muy alta performance.

Puedes conectarlo de forma nativa a múltiples productos de GCP entre los más significativos para nuestros escasos recursos son Cloud Functions y las alertas de Billing.

![Pub/Sub](/images/S01/cloud_pubsub/cloud_pubsub_image1.png)

_(opciones de productos a conectar... ¿reconoces los íconos de los productos?)_

Sin lugar a dudas querrás tener tópicos de Pub/Sub  en tu infraestructura pero debes tener presente cuales son los umbrales considerados dentro de la capa gratuita y cuanto pagarás si te pasas.

## Capa/cuota gratuita

La capa gratuita de Pub/Sub contempla los __10 primeros GB gratis__, luego de eso deberás pagar USD60 por cada TB extra, pero [entre más TB uses más barato será](https://cloud.google.com/pubsub/pricing). Esto quiere decir que tenemos _10 GB de transferencia_ y _hasta 10.000 tópicos_ que podemos utilizar __gratis__ todos los meses, si quieres más información aquí te dejo el link a las [cuotas y límites](https://cloud.google.com/pubsub/quotas#resource_limits).

## Cómo debes usarlo para no pasarte de los límites

Mientras no se muevan más de 10 GB, o no crees más de 10.000 tópicos, no deberías pagar nada.

### Ojo: Quota units

Si vamos a la documentación _en inglés_ (cosa que recomendamos ampliamente, las traducciones no siempre están al día!):

[//]: # Each measured request or response counts as the greater of 1 kB or the total size of the request or response.
[//]: # The quota usage for each request or response is rounded up to the nearest 1 kB increment. Consider a publish request with 100 messages of 50 bytes each and a topic name length equal to 30 bytes. The request's quota usage would be max(1, ceil(5030/1000)) = 6kB.

> Cada solicitud o respuesta medida cuenta como el mayor de __1 kB__ o el __tamaño total__ de la solicitud o respuesta.

> El uso de la cuota para cada solicitud o respuesta se redondea al incremento de __1 kB__ más cercano. Considere una solicitud de publicación con 100 mensajes de 50 bytes cada uno y una longitud de nombre de tema igual a 30 bytes. El uso de la cuota de la solicitud sería __max(1, ceil (5030/1000)) = 6kB__.
 

Puntualmente en la documentación se indica esto:

> Pueden producirse desajustes de cuota cuando los mensajes publicados o recibidos son menores de 1000 bytes. Por ejemplo:

>* Si publica 10 mensajes de 500 bytes en solicitudes separadas, el uso de la cuota de su publicador será de 10,000 bytes. Esto se debe a que los mensajes de menos de 1000 bytes __se redondean automáticamente__ al siguiente incremento de 1000 bytes.

>* Si recibe esos 10 mensajes en una sola respuesta, el uso de la cuota de suscriptor podría ser de sólo __5 kB__, ya que el tamaño real de cada mensaje __se combina__ para determinar la cuota general.

>* La inversa también es cierta. El uso de la cuota del suscriptor puede ser mayor que el uso de la cuota del publicador si __publica varios mensajes en una sola solicitud de publicación__ o __recibe los mensajes en respuestas separadas__.

###Todo se debe medir!

Recuerda que siempre puedes monitorear el uso de recursos.

Tu mejor aliado para esto es sin duda alguna [stackdriver](): puedes leer más respecto al monitoreo de pubsub [en este enlace](https://cloud.google.com/pubsub/docs/monitoring). Con stackdriver recuerda que puedes no sólo visualizar dashboards interactivos, lo mejor es establecer __alertas__ que te permitirán reaccionar a tiempo (para evitar sobreconsumos, por ejemplo). En el caso de pubsub, dispones de [varias métricas para monitorear](https://cloud.google.com/monitoring/api/metrics_gcp#gcp-pubsub).