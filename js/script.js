function myMap() {
	var myCenter = new google.maps.LatLng(-2.157813, -79.922417);
	var mapCanvas = document.getElementById("googleMap");
	var mapOptions = {center: myCenter, zoom: 12};
	var map = new google.maps.Map(mapCanvas, mapOptions);
}