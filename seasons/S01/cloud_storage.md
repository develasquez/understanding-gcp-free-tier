# Cloud Storage

Otro servicio fundamental en toda infraestructura es el de Almacenamiento de archivos, para ello contamos con Google Cloud Storage, este servicios nos brinda múltiples opciones de almacenamiento ya sea a nivel __Multi Regional__, es decir, tus archivos se replican en múltiples locaciones, lo que mejora el acceso y la disponibilidad ante desastres, __Regional__, que almacena tus archivos en una sola región, __Near Line__, que tiene menos costo de almacenamiento con la condición de acceder a tus archivo nos más de una vez al mes y __Cold Line__, que es el más económico de los tipos de almacenamiento, ya que se espera que accedas a tus archivo máximo una vez al año.

En la imagen a continuación tienes algunos de los posibles usos de GCS en tus arquitecturas y la posibilidad de integración con otros servicios de Google Cloud Platform

![Caso de uso Cloud Storage](/images/S01/cloud_storage/cloud_storage_diagram.png)

Hay múltiples formas de ahorrar en el uso de Cloud Storage, entre las principales están, el tener claro la cantidad de GB que serán almacenados cada mes, el nivel de replicación que los archivo tendrán, la cantidad de veces que serán accedidos y el tiempo que duren los archivos almacenados.

Veamos los costos del servicios, cuales son los límites y qué operaciones incluye la capa gratuita.

![](/images/S01/cloud_storage/cloud_storage_limits.png)

En lo que respecta a las operaciones, son estas:

* __Clase A__: Añadir objetos y enumerar segmentos y objetos
* __Clase B__: Obtener objetos y visualizar metadatos de segmentos y objetos

Otro aspecto a considerar es el uso de la red, ya que si bien podemos almacenar 5GB, __sólo tendremos 1GB de salida__ desde USA gratis.

Por lo tanto, tenemos __5GB en Storage Regional__, lo que es un **_warning_**  importante ya que los storages se crean automáticamente cómo **Múlti Regional**, así que cuando crees un Bucket debes usar el siguiente comando para que su uso se considere en la capa gratuita al crearlo solo como Regional. La documentación [aquí](https://cloud.google.com/storage/docs/creating-buckets?hl=es-419#storage-create-bucket-gsutil).

```sh
gsutil mb -c regional -l us-central1 gs://<BUCKET_NAME>/
```


Otro punto a muy importante es que GCP tambien crea storages Multi Regionales para algunos productos por defecto, dentro de los contenidos en la capa gratuita estan, App Engine, Cloud Functions, Cloud Build, Cloud container Registry entre otros, estos utilizan storage para almacenar el código que es deployado a estos servicios. 

Esto quiere decir que si utilizas Cloud Run en conjunto a Cloud Container Registry y tus imágenes Docker son muy pesadas, por ejemplo un Debian que pesa finalemente 700 u 800 MB despues de una par de versiones de tu imágen Docker tendras un par de GB que son facturables al ser multi regional, para esto re recomiendo que uses imágenes livinas de tipo [Alpine](https://hub.docker.com/_/alpine) o [Scratch](https://hub.docker.com/_/scratch) con solo los componentes necesarios.

A modo personal lo que hago es crear [**life cycles**](https://cloud.google.com/storage/docs/lifecycle) sobre los storages de App Engine, Cloud Functions y sobre todo Cloud Build (que despues de compilar no sirven para nada), para que elimine los archivos automáticamente despues de unos días.

Para crear tus propios life cycles debes primero crear un archivo json con la regla a aplicar.

lifecycle.json

```json
{
	"lifecycle": {
		"rule": [{
			"action": {
				"type": "Delete"
			},
			"condition": {
				"age": 2,
				"isLive": true
			}
		}]
	}
}
```
Como puedes ver, esto eliminará todos los archivos despues de 2 días. Para aplicar la regla, debes indicar el nombre del storage que desees y ejecutar el siguiente comando

```sh
gsutil lifecycle set lifecycle.json gs://$BUCKET_NAME;
```

Otra artimaña que sería fabulosa es la de cambiar la clase del storage, sin embargo nunca me ha resultado, por que no se puede ir de Multi-Regional a regional, por que cambia la clase no la ubicacion :( , pero por favor haz la prueba por tu cuenta, tal vez ir de Multi Regional a Nearline o Coldline

Este es un enlace a la [Documentacion](https://cloud.google.com/storage/docs/changing-storage-classes) y [esta](https://cloud.google.com/storage/docs/changing-default-storage-class);

```sh
gsutil rewrite -s [STORAGE_CLASS] gs://[PATH_TO_OBJECT]
```

Espero que estos tips te sean de utilidad, y nos vemos en el próximo articulo