# Cloud Functions

Ya que lo utilizamos en el [ejemplo introductorio]((/seasons/intro.md)), serán las primeras en nuestra revisión (este es uno de mis componentes favoritos, por su simplicidad y versatilidad).

## Características principales

Para los que no lo conocen, [Google Cloud Functions](https://cloud.google.com/functions/) es uno de los productos [serverless](https://cloud.google.com/serverless/) de GCP, y nos permite ejecutar una función específica sin la necesidad de preocuparnos de lo demás temas (como dónde se ejecuta la función, por ejemplo). Si quieres conocerla mejor [puedes ver esta charla](https://www.youtube.com/watch?v=4IewxFRGUko) que dimos con [Iván Olivares Rojas](https://medium.com/u/62f5f65fb29b) en las oficinas de [Globant](https://medium.com/u/9a82c850e61f) Chile.

Básicamente, con Cloud Functions te olvidas de todo lo que ves en la siguiente imagen: 

![](/images/chapter-1/cloud_functions/cloud_functions_explanation1.png)

y pasas a un esquema donde te enfocas exclusivamente al código *desde tu función en adelante*; Google Cloud crea y administra todo el resto de componentes requeridos para la solución, por ti:

![](/images/chapter-1/cloud_functions/cloud_functions_explanation2.png)

Cloud Functions puede ser activado de múltiples formas, las más conocidas son *invocación por pedidos HTTP*, *eventos generados en Cloud Storage* y *mensajes gatillados en un tópico de Pub/Sub*, sin embargo tiene muchos más: te invito a verlos en [este link](https://cloud.google.com/functions/docs/calling/).

## Capa/cuota gratuita

En lo que respecta a la capa gratuita encontramos los siguientes umbrales:

![](/images/chapter-1/cloud_functions/cloud_functions_free_tier_limits.png)

Esto significa que, de forma combinada, entre __*todas*__ las Cloud Functions de __*todos*__ tus proyectos, __si no sobrepasas esos límites, no pagarás por tener cargas de trabajo desplegadas en Cloud Functions__.

## Cómo debes usarlo para no pasarte de los límites

Recuerda, tal como vimos en el ejemplo introductorio, para que la facturación sea $0 debes tener en cuenta los siguientes valores promedio de tus Cloud Functions:

![For Free](/images/chapter-1/cloud_functions/cloud_functions_free_tier_limits_calc.png)

No hay restricciones respecto a la cantidad de Cloud Functions: puedes tener las que quieras repartidas en todos tus proyectos. Lo importante es que consideres que para el umbral gratuito, se considera la suma entre todas las que existan bajo tu cuenta.
