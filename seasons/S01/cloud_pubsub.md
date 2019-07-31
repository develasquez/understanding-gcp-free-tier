# Cloud Pub/Sub

Otro servicio icono de GCP es [Cloud Pub/Sub](https://cloud.google.com/pubsub/), este es un servicio full administrado de mensajería, fundamental para tus arquitecturas basadas en eventos, ya que puedes definir un tópico y asociados a este, tener tanto publicadores de mensajes, cómo suscriptores interesados en los mensajes de dicho tópico.

Pub/Sub al ser full administrado por Google escala según la necesidad de forma automática y tiene una muy alta performance.

Puedes conectarlo de forma nativa a múltiples productos de GCP entre los más significativos para nuestros escasos recursos son Cloud Functions y las alertas de Billing.

![Pub/Sub](/images/S01/cloud_pubsub/cloud_pubsub_image1.png)

Sin lugar a dudas querrás tener tópicos de Pub/Sub  en tu infraestructura pero debes tener presente cuales son los umbrales considerados dentro de la capa gratuita y cuanto pagarás si te pasas.

La capara gratuita de Pub/Sub contempla los __10 primeros GB gratis__, luego de eso deberás pagar 60 USD por cada TB y [entre más TB uses más barato será](https://cloud.google.com/pubsub/pricing). Esto quiere decir que tenemos 10 GB de transferencia y hasta 10.000 tópicos que podemos utilizar gratis todos los meses, si quieres más info aquí te dejo el link a las [cuotas y límites](https://cloud.google.com/pubsub/quotas).