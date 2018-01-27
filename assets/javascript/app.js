  //Initialize map
  var map, infoWindow;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
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

        //Find ice cream at current location
        $.ajax({
          type: "GET",
          headers: {
            'user-key': '8851beeb86b413ae8755c9637e970ea1'
          },
          url: 'https://developers.zomato.com/api/v2.1/search?lat=' + initialLat + '&lon=' + initialLng + '&radius=2000&cuisines=233&count=1',
          dataType: 'json',
          processData: true,
          success: function (response) {
            console.log(response);

            var urlIceCream = response.restaurants[0].restaurant.url;

            var nameIceCream = response.restaurants[0].restaurant.name;

            console.log(urlIceCream);
            console.log(nameIceCream);
          }
        });


        //Grab new longitude/latitude from moved marker
        function markerCoords(markerobject) {
          google.maps.event.addListener(markerobject, 'dragend', function (evt) {
            infoWindow.setOptions({
              content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
            });

            console.log("New latitude: " + evt.latLng.lat());
            console.log("New longitude: " + evt.latLng.lng());

            var newLat = evt.latLng.lat();
            var newLng = evt.latLng.lng();

            //Find ice cream at new location
            $.ajax({
              type: "GET",
              headers: {
                'user-key': '8851beeb86b413ae8755c9637e970ea1'
              },
              url: 'https://developers.zomato.com/api/v2.1/search?lat=' + newLat + '&lon=' + newLng + '&radius=2000&cuisines=233&count=1',
              dataType: 'json',
              processData: true,
              success: function (response) {
                console.log(response);

                var urlIceCream = response.restaurants[0].restaurant.url;

                var nameIceCream = response.restaurants[0].restaurant.name;

                console.log(urlIceCream);
                console.log(nameIceCream);
              }
            });

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

      $("")


    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }