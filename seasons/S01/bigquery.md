# Bigquery

Otra de las Joyas de la corona de Google Cloud es Bigquery, esta es una de las bases de datos que más cariño le ha puesto Google y el hacerlo le ha ganado una gran aceptación por parte de los usuarios, llevandola a estar en la cima del **Cuadro de Gartner** como la mejor Base de Datos de Analytica y Businness Inteligent.

Esta Base de Datos es el __estado del arte__ para Google en lo que respecta a procesamiento distribuido de Millones de datos o PB de datos en solo segundos. Logrado gracias a que procesa los datos de forma distribuida, por medio de miles de workers que realizan el análisis de pedacitos de tus datos, hasta lograr finalmente el resultado de tus queries sobre grandes volumenes de datos en un instante.

Si quieres conocerla mejor acá te dejo un link a la [descripción oficial](https://cloud.google.com/bigquery/), de seguro vas a amar esta Base de Datos.

En este articulo veremos 2 aspectos muy importantes de Bigquery en nuestra misión de optimizar la gestion de los costos de Google Cloud y en especial en sacar el máximo provecho a la capa gratuita de GCP.

* __Entendamos la capa gratuita de Bigquery.__
* __Performance y Optimización en el uso para reducir los costos.__

## Entendamos la capa gratuita de Bigquery

Hasta aquí todo bien con Bigquery, pero hablemos de dinero, veamos qué nos ofrece GCP para esta Base de Datos en su capa gratuita.

![capa gratuita bigquery](/images/S01/bigquery/limits.png)

Como vemos los primeros __10 GB__ de almacenamiento de cada mes son gratuitos, esto es bastante, ahora bien recuerda que Bigquery también cobra por los GB que debes mover para hacer cada consulta, para ello la capa gratuita nos da __1 TB__ en querys sin costo.
Y cómo vemos en la tabla hay algunos conceptos asociados a ML (Machine Learning) que también tenemos gratis. ☺

Cabe destacar que estos límites se desglosan de la siguiente manera:

* las sentencias de tipo SELECT y PREDICT cuentan con __1 TB__ gratis.
* Las sentencias CREATE MODEL cuenta con __10 GB__ gratis.


### Bigquery Sandbox

![Sin tarjeta de credito](/images/S01/bigquery/portada_bigquery.png)

Como regalo por parte de Google tenemos [Bigquery Sandbox](https://cloud.google.com/bigquery/docs/sandbox), que es la posibilidad de contar con esta misma capa gratuita pero en proyectos sin la necesidad de estar asociados a una tarjeta de crédito o cuenta de billing.

Va en tu creatividad el como utilices los múltples proyectos que puedas crear usando sandbox. _Como principal diferencia con la capa gratuita Bigquery Sandbox almacena los datos por 60 días luego de esto los elimina_. Más abajo ajunos tips para afrontar esta limitación. 

![sin billing](/images/S01/bigquery/bigquery_sandbox.png)

### Costos 

Entremos en detalle en la forma en la que Bigquery [cobra por el uso de este servicio](https://cloud.google.com/bigquery/pricing).

#### Costos de Almacenamiento

* __Active Storage__: Se considera almacenamiento activo a todo dato que se haya creado o modificado en los últimos 90 días.

* __Long Term Storage__: Estos datos tienen un costo menor ya que engloba a todos los datos que se encuentran almacenados pero no se han consumido o consultado dentro de los últimos 90 días.

#### Costos de Consultas


* __On Demand__: Es la forma standrad de cobro,efectuada por cada consulta realizada y se basa en la cantidad de datos involucrados en el procesamiento de la query. Este es el tipo de cobro asociado a la capa gratuita y en base al que veremos más adelante como usar Bigquery de forma optima para no elevar estos costos innecesariamente.

* __Flat Rate__: Esta modalida permite tener una tarifa plana por el uso de Bigquery que va desde los __USD 40.000__ en adelante: Acorde al plan de tarifa plana seleccionado es la cantidad de recursos (workers) que se fijan como límite para ralizar las consultas.

## Performance y Optimización en el uso para reducir los costos

Son muchas las consideraciones que podemos tener para optimizar el costo de Bigquery por eso te dejo un [articulo hermoso aquí!!!](https://medium.com/google-cloud/bigquery-optimized-cluster-your-tables-65e2f684594b), las [buenas prácticas oficiales acá](https://cloud.google.com/bigquery/docs/best-practices-performance-compute) y una serie de tips maravillosos.

### Tips

#### Tips de costos

* Al insertar una columna se considera un tamaño mínimo de __1 KB__ insertado, ojo con la suma.
* Los datos insertados desde __Google Cloud Storage__ no se cobran.
* Copiar los datos a otra tabla no tiene coston ni de lectura ni de inserción, pero si se cobra el almacenamiento de los nuevos datos. 
* Lo anterior puede ser muy util en Bigquery Sandbox y su limitación de 60 días y si lo combinas con [Schedule Queries](TODO) es un golazo ☺.
* Exportar datos no tiene costo.
* Se cobra por todos los datos procesados a pesar de usar __LIMIT__.

#### Tips de Performance

* Trata de no transformar datos con la query
* Clusteriza tus Tablas
* Trata de buscar campos relevante para la clusterizacion, Fechas o grupos grandes.
* En la querys respeta el orden de los clusters.
* Aplica los filtros antes de Ordenar asi el ordenamiento se hace sobre menos data.
* Normaliza las tablas y usa correctamente los JOINS
* Usa __GROUP BY__ en base a los campos clusterizados.



### Performace y Optimizacion

Acompañame a ver algunas herramientas y buenas prácticas que nos ayudarán a optimizar nuestras consultas y así sacar el máximo provecho a la cápa gratuita. 

| _Ojo, estos tips sirven mucho incluso si usas Bigquery mas alla de la capa gratuita_.


* __[Plan de Ejecución](TODO)__: Es un análisis realizado por Bigquery sobre la conulta que se va a relizar, este muestra un reporte indicando mutiples aspectos tales como,uso de computo, uso de memoria, y recursos de I/O. Utilizar esta herramienta para comprender que operaciones son mas costosas dentro de nuestras consultas nos puede ayudar a encontrar puntos de mejora que redunden en ahorro de dinero.
Esta herrameinta es todo un mundo en si misma, te dejo el [link a la documentacion](TODO) y disfrutala.

* __[Funciones de Agregación Aproximadas](TODO)__: Es una serie de funciones pensada en analítica de grandes volumenes de datos y destinada a consultas que no requieren un resultado tan fino. Esto quiere decir que funciones como __COUNT_DISTINC__ y __APPROX_COUNT_DISTINCT__ cumplen la misma labor pero el resultado es menos certero en el caso del comando de tipo APPROX. Sin embargo estos tipos de funciones consumen mucho menos recursos por ende son mas económicas que sus homologas mas detallistas.
Estas son las que se encuentran disponibles y [aquí esta la docuentación](TODO).
    + APPROX_COUNT_DISTINCT
    + APPROX_QUANTILES
    + APPROX_TOP_COUNT
    + APPROX_TOP_SUM

* __[Partición de Tablas](TODO)__: Al crear una tabla en Bigquery es posible establecer un punto de partición para dicha tabla (Pseudo columna), de esta forma se crea una especie de paginación basada en una columna de tipo fecha. Esto quiere decir que tendremos multiples pedasos de la misma tabla agrupada ya sea por la misma fecha o por la misma hora, esto permite optimizar mucho la performance y los costos ya que si incluimos este campo en el WHERE se estará consultando sobre un conjunto acotado de datos y no sobre la totalida. 
Estas son los Pseudo Columnas disponibles y [aquí esta la documentación](TODO)

    + [PARTITIONDATE](https://cloud.google.com/bigquery/docs/querying-partitioned-tables?hl=es#ingestion?time_partitioned_table_pseudo_columns)

    + [PARTITIONTIME](https://cloud.google.com/bigquery/docs/querying-partitioned-tables?hl=es#ingestion?time_partitioned_table_pseudo_columns)

* __[require_partition_filter](TODO)__: Esta configuracion asociada a una tabla obliga a que se indiquen los campos de clusterización en el __WHERE__ de la query. Esto lo puedes hactivar con __require_partition_filter=true__ en la creación de la tabla.

Estoy seguro de que le vas a sacar el jugo a estos consejos y más aun le vas a sacar el máximo provecho a la capa gratuita de Google Cloud.

Nos vemos en el próximo articulo...