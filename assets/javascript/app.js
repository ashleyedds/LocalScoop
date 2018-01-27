$(document).ready(function(){
  $('.carousel').carousel();
});

//Initialize map
var map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.50, lng: -98.35 },
    zoom: 7
  });
  infoWindow = new google.maps.InfoWindow;


  //Determine current location, initial latitude/longitude
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      console.log("Initial latitude: " + pos.lat);
      console.log("Initial longitude: " + pos.lng);

      var initialLat = pos.lat;
      var initialLng = pos.lng;


      //Create marker for current location, make it draggable
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        draggable: true,
      });


      //Grab new longitude/latitue from moved marker
      function markerCoords(markerobject) {
        google.maps.event.addListener(markerobject, 'dragend', function (evt) {
          infoWindow.setOptions({
            content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
          });

          console.log("New latitude: " + evt.latLng.lat());
          console.log("New longitude: " + evt.latLng.lng());

          var newLat = evt.latLng.lat();
          var newLng = evt.latLng.lng();

          infoWindow.open(map, markerobject);
        });

        google.maps.event.addListener(markerobject, 'drag', function (evt) {
          console.log("marker is being dragged");
        });
      }

      //Call function to capture new location
      markerCoords(marker);

      infoWindow.open(map);
      map.setCenter(pos);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });


  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
