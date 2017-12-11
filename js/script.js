var http_request = false;
var respuesta = false;
var latitud = -1.406514;
var longitud = -78.625337;
var cerca = 7;


function makeRequest(url) {

    http_request = false;

    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {
            http_request.overrideMimeType('application/json');
            // Ver nota sobre esta linea al final
        }
    } else if (window.ActiveXObject) { // IE
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {}
        }
    }

    if (!http_request) {
        alert('Falla :( No es posible crear una instancia XMLHTTP');
        return false;
    }
    http_request.onreadystatechange = myMap;
    http_request.open('GET', url, true);
    http_request.send(null);
}

function myMap() {
    if (http_request.readyState == 4) {
        if (http_request.status == 200) {

            respuesta = JSON.parse(http_request.response);
            console.log(respuesta);

            var myCenter = new google.maps.LatLng(latitud, longitud);
            var mapCanvas = document.getElementById("googleMap");
            var mapOptions = {center: myCenter, zoom: cerca};
            var map = new google.maps.Map(mapCanvas, mapOptions);

            var i=0;

            var coordenadas = []
            var informacion = []

            for (clave in respuesta) {

              for (perro in respuesta[clave]) {
                coordenadas[i] = {lat: parseFloat(respuesta[clave][perro]["latitud"]), lng: parseFloat(respuesta[clave][perro]["longitud"])};

                informacion[i] = "<div id='content'"+
                                   "<div id='siteNotice'>"+
                                   "</div>"+
                                     "<div class='contentImg text-center'>"+
                                       "<img src=" + respuesta[clave][perro]["imagen"] + " title=" + perro + " width=25%/>"+
                                     "</div>"+
                                     "<div class='contentTxt'>"+
                                       "<h3 id='nombrePerro' align=center><center>" + perro + "</center></h3>"+
                                       "<p><b>Edad: </b>" + respuesta[clave][perro]["edad"] + " </p>"+
                                       "<p><b>Sexo: </b>" + respuesta[clave][perro]["sexo"] + " </p>"+
                                       "<p><b>Raza: </b></b>" + respuesta[clave][perro]["raza"] + " </p>"+
                                       "<p><b>Descripci&oacute;n: </b>" + respuesta[clave][perro]["descripcion"] + " </p>"+
                                       "<p><b>Direcci&oacute;n: </b>" + respuesta[clave][perro]["direccion"] + " </p>"+
                                       "<p><b>Contacto: </b><a href='tel:+593" + respuesta[clave][perro]["contacto"].substr(1,9) + " '>" + respuesta[clave][perro]["contacto"] + " </a> <a href='tel:+593" + respuesta[clave][perro]["contacto"].substr(1,9) + " '><img src=http://www.vodafone.es/static/imagen/pre_ucm_mgmt_003892.gif title=Llamar></a></p>"+
                                     "</div>"+
                                     "<div class='clear'></div>"+
                                 "</div>";
                i++;
              }
            }

            i=0;

            for (clave in respuesta) {

              for (perro in respuesta[clave]) {
                var marker = new google.maps.Marker({
                  position: coordenadas[i],
                  map: map,
                  icon: respuesta[clave][perro]["tipo"],
                  title: "" + perro + "",
                });

                var infowindow;

                (function(i, marker) {
                  google.maps.event.addListener(marker,'click',function() {
                    if (!infowindow) {
                      infowindow = new google.maps.InfoWindow();
                    }
                    infowindow.setContent(informacion[i]);
                    infowindow.open(map, marker);
                  });
                })(i, marker);

                i++;
              }
            }

        } else {
            alert('Hubo problemas con la petición.');
        }
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    latitud = parseFloat(position.coords.latitude);
    longitud = parseFloat(position.coords.longitude);
    cerca = 17;
}

window.onload = function() {
	getLocation();

	makeRequest('data/animales.json');

	document.getElementById("actualizar").addEventListener("click", function(){
    latitud = -1.406514;
    longitud = -78.625337;
    cerca = 7;
		makeRequest('data/animales.json');
    getLocation();
	});

  document.getElementById("ubicar").addEventListener("click", function(){
    makeRequest('data/animales.json');
  });
}