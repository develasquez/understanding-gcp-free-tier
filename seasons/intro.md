# Qué es y cómo funciona la capa gratuita de GCP

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

![](/images/chapter-1/cloud_functions/cloud_functions_ejemplo1.png)

En la imagen anterior, podemos ver una Cloud Function que se ejecuta sólo *1 millón de veces por mes*, el tamaño del payload es regular (*2.5 kb*), pero su tiempo de ejecución es de *30 segundos* por cada llamada: como verás en la siguiente imagen, el costo mensual se dispara a __USD 66__.

![](/images/chapter-1/cloud_functions/cloud_functions_ejemplo2.png)

Este ejemplo nos recuerda lo cautelosos que debemos ser al utilizar cada servicio: conocer sus umbrales y en especial tener en cuenta __para qué fue creado cada producto__. Siguiendo nuestro ejemplo de Cloud Functions, si vamos a enfrentar más de 30 segundos de procesamiento por cada llamada, entonces claramente Cloud Functions __no es la herramienta idónea__ (para nuestro propósito de gastar lo menos posible). En este escenario, debemos considerar algún servicio que __no__ tenga una estructura de cobro por ejecución. Sólo como referencia de las posibilidades que hay, en [Google Compute Engine](https://cloud.google.com/compute/) USD 24,75 mensuales por 730 horas de ejecución continua de una instancia *n1-standard-1* ó USD 0 (sí, cero!) con una *f1-micro*.

Ahora que tenemos claro cómo se factura el uso de los servicios en GCP vamos a dar un vistazo a los principales productos y los límites que comprenden su capa gratuita. Para esto, revisa el [desglose de artículos](/seasons/S01/index.md).
