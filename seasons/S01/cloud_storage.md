# Cloud Storage

Otro servicio fundamental en toda infraestructura es el de Almacenamiento de archivos, para ello contamos con Google Cloud Storage, este servicios nos brinda múltiples opciones de almacenamiento ya sea a nivel __Multi Regional__, es decir, tus archivos se replican en múltiples locaciones, lo que mejora el acceso y la disponibilidad ante desastres, __Regional__, que almacena tus archivos en una sola región, __Near Line__, que tiene menos costo de almacenamiento con la condición de acceder a tus archivo nos más de una vez al mes y __Cold Line__, que es el más económico de los tipos de almacenamiento, ya que se espera que accedas a tus archivo máximo una vez al año.

En la imagen a continuación tienes algunos de los posibles usos de GCS en tus arquitecturas y la posibilidad de integración con otros servicios de Google Cloud Platform

![Caso de uso Cloud Storage](/images/S01/cloud_storage/cloud_storage_diagram.png)

Hay múltiples formas de ahorrar en el uso de Cloud Storage, entre las principales están, el tener claro la cantidad de GB que serán almacenados cada mes, el nivel de replicación que los archivo tendrán, la cantidad de veces que serán accedidos y el tiempo que duren los archivos almacenados.

Veamos los costos del servicios, cuales son los límites y qué operaciones incluye la capa gratuita.

![](/images/S01/cloud_storage/cloud_storage_limits.png)


Por lo tanto, tenemos __5GB en Storage Regional__, lo que es un _warning_ importante ya que los storages se crean automáticamente cómo Múlti Regional, así que cuando crees un Bucket debes usar el siguiente comando para que su uso se considere en la capa gratuita al crearlo solo como Regional.

```sh
gsutil mb -c regional -l us-central1 gs://<BUCKET_NAME>/
```

En lo que respecta a las operaciones, son estas:

* __Clase A__: Añadir objetos y enumerar segmentos y objetos
* __Clase B__: Obtener objetos y visualizar metadatos de segmentos y objetos

Otro aspecto a considerar es el uso de la red, ya que si bien podemos almacenar 5GB, __sólo tendremos 1GB de salida__ desde USA gratis.