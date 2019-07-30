 var apiKey = 'AIzaSyDS5IIUpsxEdmdLeg5WTlYx9i4wGofKDS8';
 var currentPlayer = {};
 var currentResults = [];
 var currentOptionPressed = {};
 var selectedlista = {};
 var listas = [];

 function download(name, data) {
   var downObj = document.createElement("a");
   downObj.setAttribute("href", data);
   downObj.setAttribute("download", name + ".mp3");
   downObj.style.display = "none";
   document.body.appendChild(downObj);
   downObj.click();
   document.body.removeChild(downObj);
 }

 function init() {

   try {
     var sdPath = 'Music';
     gapi.client.setApiKey(apiKey);
     gapi.client.load('youtube', 'v3', function(a, b, c) {
         currentPlayer = localStorage.getItem("currentPlayer");
         if (currentPlayer) {
           $(".tituloCancion").text(currentPlayer.snippet.title);
           $(".caratula, .caratulaReproduciendo").attr("src", currentPlayer.snippet.thumbnails.high.url);
           setListItems(localStorage.getItem("resultsList"), function() {
             if ($('#info li').length < 20) {
               buscarVideos(nextPageToken);
             } else {
               monomer.hideLoading();
               localStorage.setItem("resultsList", currentResults);
             }
           });
         }
       })
       //downloader.init({folder: sdPath});
   } catch (ex) {
     console.log(ex);
   }
 }
 audio = {
   src: '',
   evalPlugin: function() {
     return false;
     if (window.plugins && window.plugins.NativeAudio) {
       return true;
     } else {
       return false;
     }
   },
   load: function(url, _fun) {
     if (audio.evalPlugin()) {
       window.plugins.NativeAudio.preloadComplex('player', url, 1, 1, 0, _fun, function(msg) {
         console.log('error: ' + msg);
       });
     } else {
       player = $("#player")[0];
       player.src = url
       player.load();
       _fun();
     }
   },
   play: function(url, _fun) {
     if (!url && !_fun) {
       if (audio.evalPlugin()) {
         window.plugins.NativeAudio.play('click');
       } else {
         player = $("#player")[0];
         player.play()
       }
       return;
     }
     audio.load(url, function() {
       audio.src = url;
       if (audio.evalPlugin()) {
         window.plugins.NativeAudio.play('click', function() {}, function() {}, function() {
           _fun("#player")
         });
       } else {
         player = $("#player")[0];
         $("#player").unbind('ended');
         $("#player").on('ended', function(element) {
           _fun("#player")
         });
         player.play();
       }
     })
   },
   pause: function() {
     if (audio.evalPlugin()) {
       window.plugins.NativeAudio.play('click');
     } else {
       player = $("#player")[0];
       player.pause()
     }
   }
 }

 document.addEventListener('deviceready', function() {
   navigator.splashscreen.hide();
   Ads.initAds();
   Ads.android.banner = 'ca-app-pub-7212681562680695/3725543565';
   Ads.android.interstitial = 'ca-app-pub-7212681562680695/4584997965';
   Ads.ios.banner = 'ca-app-pub-7212681562680695/3725543565';
   Ads.ios.interstitial = 'ca-app-pub-7212681562680695/4584997965';
   Ads.startBannerAds();
   Ads.showBannerAds();
 }, false);
 $(function() {
   /*document.addEventListener('DOWNLOADER_downloadSuccess', function(event){
     monomer.toast("Descarga Finalizada");
   });
   document.addEventListener('DOWNLOADER_downloadError', function(event){
     monomer.toast("Error en la Descarga");
   });*/

   monomer.pageShow('#busqueda');
   $("#txtBuscar").on("keypress", function(evt) {
     if (evt.charCode == 13) {
       $("#btnBuscar").click();
     }
   });
   getListas();
   $(".content").on("scroll", function(a, b) {
     if ((a.currentTarget.scrollHeight - $(".content").height()) == a.currentTarget.scrollTop) {
       buscarVideos(nextPageToken);
     }
   });
   $(".dvYoutuve").on("click", function() {
     var element = $("#player").data("data");

     audio.pause();


     iconPause();
     window.open("https://www.youtube.com/watch?v=" + element.id, '_blank', 'location=no');
   })
   $(".dvPrevia").on("click", function() {
     var element = $("#player").data("data");
     $("#" + element.id).prev().find("h3").click();
   })
   $(".play").on("click", function() {
     tooglePlay();
   });
   $(".dvProxima").on("click", function() {
     var element = $("#player").data("data");
     $("#" + element.id).next().find("h3").click();
   })
   $(".dvDownload").on("click", function() {
     monomer.toast("Descarga Iniciada");
     downloadMp3(audio.src, $(".tituloCancion").text())
   })
   $(".dvYoutuveOp").on("click", function() {


     audio.pause();

     iconPause();
     window.open("https://www.youtube.com/watch?v=" + currentOptionPressed.id.videoId, '_blank', 'location=no');
   })
   $(".dvDownloadOp").on("click", function() {
     monomer.toast("Descarga Iniciada");
     getUrl(currentOptionPressed, function(url, item) {

       downloadMp3(url, item.snippet.title)
     })
   })

   $(".dvToListOp").on("click", function() {

     mostarListas();
   });

   $("#txtBuscar").on("drop", function drop(ev) {
     ev.preventDefault();

     var data = ev.dataTransfer.getData("text");
     $.get(data, function(html) {
       var q = $(html).find(".primary-title").text() + " " + $(html).find(".secondary-title").text();
       $("#txtBuscar").val(q);
       buscarVideos();
     })
   })
 });
 var tooglePlay = function() {
   if ($(".play").hasClass("icon-play")) {
     $(".play").removeClass("icon-play");
     $(".play").addClass("icon-pause");

     audio.play();
     if (audio.src == "") {
       playSong(currentPlayer);
     }


   } else {
     $(".play").removeClass("icon-pause");
     $(".play").addClass("icon-play");

     audio.pause();

   }


 };
 var iconPlay = function() {
   $(".play").removeClass("icon-play");
   $(".play").addClass("icon-pause");
 };
 var iconPause = function() {
   $(".play").removeClass("icon-pause");
   $(".play").addClass("icon-play");
 };
 var nextPageToken = '';
 var listItem = function(data) {
   return [
     '<li>',
     '<div>',
     '<div class="test_box fab z-d1">',
     '<img src="' + data.snippet.thumbnails.high.url + '" alt="' + data.snippet.title + '"> ',
     '</div>',
     '</div>',
     '<div>',
     '<div>',
     '<h3>' + data.snippet.title + '</h3>',
     '</div>',
     '<span class="expand-config button-right icon-ellipsis-v icon-1x icon-black trackOptions" target=".configMenu">',
     '</span>',
     '</div>',
     '</li>',
   ].join("\n");
 };


 function downloadMp3(url, fileName) {

   //document.location.href = url;
   download(fileName, url);
 }

 var resp = {};

 function getVideoDetails(item, _fun) {
   var videoId = item.id.videoId;
   gapi.client.youtube.videos.list({
       id: videoId,
       part: 'contentDetails'
     })
     .execute(function(response) {
       try {
         duration = response.items[0].contentDetails.duration;
         time = duration
           .replace("PT", (duration.indexOf("H") > -1 ? "" : ":"))
           .replace("H", ":")
           .replace("M", ":")
           .replace("S", "")
           .split(":");

         hora = parseInt(time[0]) || 0;

         minuto = parseInt(time[1]) || 0;

         segundo = parseInt(time[2]) || 0;



         if (!(hora > 0 || minuto > 20)) {

           _fun(item, response, time)
         } else {
           _fun(null, null, null);
         }
       } catch (ex) {
         _fun(null, null, null);
       }

     })
 }


 function playSong(item) {

   getUrl(item, function(url, item) {
     localStorage.setItem("currentPlayer", item);
     $("#player").data("data", JSON.stringify({
       id: item.id.videoId
     }));
     audio.play(url, function(player) {
       var element = $(player).data("data");
       $("#" + element.id).next().find("h3").click();
     });

     iconPlay();
     monomer.toast(item.snippet.title);
     $(".tituloCancion").text(item.snippet.title);
     $(".caratula, .caratulaReproduciendo").attr("src", item.snippet.thumbnails.high.url);
   });
 }

 function getUrl(item, _fun) {
   $.ajax({url: "https://mp3.music.desamovil.cl/mp3/?url=https://www.youtube.com/watch?v=" + item.id.videoId+"&name=" + item.snippet.title,
   success:  function(response) {
     _fun(response.url, item);
   },timeout: 60000});
 }


 var totalItemsToList = 0;
 var currentItemProcessing = 0;


 function getListas() {
   service.getLists(function(items) {
     listas = items;
     localStorage.setItem("listas", listas);
     $.each(listas, function(index, item) {
       if (!localStorage.getItem(item.nombreLista)) {
         localStorage.setItem(item.nombreLista, JSON.parse(item.items));
       }
     })
     actualizarListas();
   });
 }

 function setListItems(items, _fun) {
   currentItemProcessing = 0;
   totalItemsToList = items.length;
   for (var item in items) {
     item = items[item];
     if (typeof(item) != "function") {
       currentResults.push(item)
       if (item.id.videoId) {
         getVideoDetails(item, function(item, response, time) {

           currentItemProcessing++;
           if (item) {
             var newVideo = $(listItem(item));
             $(newVideo).attr("id", item.id.videoId).data("data", JSON.stringify(item))
             $(newVideo).delegate("img, h3", "click", function(a, b, c) {
               playSong($(a.originalEvent.currentTarget).data("data"));
             });
             $(newVideo).delegate(".trackOptions", "click", function(a, b, c) {
               currentOptionPressed = $(a.originalEvent.currentTarget).data("data");
             });
             $('#info').append(newVideo);
           }
           if (currentItemProcessing == totalItemsToList) {
             monomer.__init();
             monomer.__setAspect();
             _fun();

           }
         })
       } else if (item.id.channelId || item.id.playlistId) {
         currentItemProcessing++;
       }
     };
   }
 }

 function sugerencias(q, _fun) {
   var request = gapi.client.youtube.search.list({
     q: q,
     part: 'snippet',
     type: 'video',
     maxResults: 20
   });
   request.execute(function(response) {
     _fun();
   })
 }

 function buscarVideos(PageToken) {
   if ($("#txtBuscar").val() == "") {
     return false;
   }

   if (!PageToken) {
     PageToken = '';
     $('#info').html("");
     currentResults = [];
     totalItemsToList = 0;
     monomer.showLoading();
   }
   var q = $('#txtBuscar').val();
   var request = gapi.client.youtube.search.list({
     q: q,
     part: 'snippet',
     type: 'video',
     maxResults: 20,
     pageToken: PageToken
   });

   request.execute(function(response) {
     try {
       nextPageToken = response.nextPageToken;
       setListItems(response.result.items, function() {
         if ($('#info li').length < 20) {
           buscarVideos(nextPageToken);
         } else {
           monomer.hideLoading();
           localStorage.setItem("resultsList", currentResults);
         }
       });

     } catch (ex) {

     }

   });
 }

 function mostarListas() {

   monomer.showDialog("#popupListas");
 }

 function nuevaLista() {
   var nombre = $("#txtNombreNuevaLista").val();
   if (nombre.length > 20) {
     monomer.toast("Máximo 20 letras");
     return false;
   }
   var newList = {
     _id: "",
     nombreLista: nombre,
     traks: 0
   };

   if (listas.where({
       nombreLista: nombre
     }).length == 0) {
     listas.push(newList);
     localStorage.setItem("listas", listas);
     localStorage.setItem(nombre, []);
     if (currentOptionPressed) {
       service.setNewList({
         users: "57d3686603beaf023a393ccf",
         nombreLista: nombre,
         traks: 0,
         items: ""
       }, function(lista) {

         agregarALista(nombre, currentItemProcessing, lista._id)
       });
     }


     actualizarListas();
   }

   $("#txtNombreNuevaLista").val("");
 };

 function agregarALista(nombre, item, lista) {
   var theList = localStorage.getItem(nombre);
   if (theList.where({
       "id.videoId": currentOptionPressed.id.videoId
     }).length == 0) {
     theList.push(currentOptionPressed);
     localStorage.setItem(nombre, theList);
     service.updateList({
       _id: lista,
       traks: theList.length,
       items: JSON.stringify(theList)
     }, function() {
       getListas();
     });
     monomer.toast("Añadido a lista " + nombre)
   } else {
     monomer.toast("La canción ya está en la lista " + nombre)
   }


 };

 function actualizarListasPopup() {
   try {
     $("#ListasReprododuccionLst").html("");

     for (var i = 0; i < listas.length; i++) {

       var newLi = $("<li>").text(listas[i].nombreLista)
         .attr("id", listas[i]._id)
         .on("click", function(evt) {
           var nombre = $(this).text();
           var _id = $(this).attr("id");
           agregarALista(nombre, currentItemProcessing, _id);
           monomer.hideDialog();
         })
       $("#ListasReprododuccionLst").append(newLi);
     }
     monomer.refresh();
   } catch (ex) {}
 }

 function actualizarListas() {

   actualizarListasPage();
   actualizarListasPopup();

 }

 function actualizarListasPage() {
   //Actualiza en pagina
   $("#dvListas").html("");
   for (var i = 0; i < listas.length; i++) {
     try {
       var thelist = localStorage.getItem(listas[i].nombreLista);
       var imagenes = [];
       for (var j = 0; j < thelist.length; j++) {
         if (j < 4) {
           imagenes.push(thelist[j].snippet.thumbnails.high.url);
         }
       }
       var newListItem = $(htmlLista(listas[i].nombreLista, imagenes))
         .data("data", JSON.stringify(listas[i]))
         .on("click", function() {
           selectedlista = $(this).data("data");
           $('#info').html("");
           currentResults = localStorage.getItem(selectedlista.nombreLista);
           localStorage.setItem("resultsList", currentResults);
           setListItems(currentResults, function() {
             monomer.pageShow('#busqueda');
           })
         })
       $("#dvListas").append(newListItem);
     } catch (ex) {

     }
   }
 }
 htmlLista = function(nombre, imagenes) {

   var imagenesHtml = '<img src="img/yom.png" alt="" class="aspect_1_1">';
   var insertedImg = 0;
   for (var i = 0; i < imagenes.length; i++) {
     if (i == 0) {
       imagenesHtml = '';
     };
     if (i < 4) {
       imagenesHtml += '<img src="' + imagenes[i] + '" alt="" class="CLASS">';
       insertedImg++;
     }

   };
   var clase = "aspect_1_1";
   switch (insertedImg) {
     case 2:
       {
         clase = "listaImgX2";
       }
       break;
     case 3:
       {
         //imagenesHtml.splice(2);
         clase = "listaImgX2";
       }
       break;
     case 4:
       {
         clase = "listaImgX4";
       }
       break;
   }
   imagenesHtml = imagenesHtml.replace(/CLASS/g, clase);
   return [
     '<div class="card card_35 background_control">',
     '<div class="media grey aspect_1_1">',
     imagenesHtml,
     '</div>',
     '<div class="text">',
     '<h3 class="nombreLista">' + nombre + '</h3>',
     '</div>',
     '</div>'
   ].join("\n");
 }