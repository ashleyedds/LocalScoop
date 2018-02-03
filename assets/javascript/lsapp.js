var articleCounter = 0;
var getDate = moment().subtract(7, "days").format("YYYY-MM-DD");
var currentCity;
var currentLat;
var currentLng;
var placeClick = false;

$('.carousel').carousel();
$(".dropdown-button").dropdown();
$(".button-collapse").sideNav();


function initMap() {
  var map, infoWindow;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
    });
  // infoWindow = new google.maps.InfoWindow;
  

  // Determine current location, initial latitude/longitude
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
      getState(initialLat, initialLng);
      clearResults();
      runWeatherSearch(initialLat, initialLng);
      getIceCream(initialLat, initialLng);

      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: initialLat, lng: initialLng },
        zoom: 8
      });
      

      //Create marker for current location, make it draggable
      var marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: "Test",
        draggable: true,
      });

    

      //Grab new longitude/latitue from moved marker
      function markerCoords(markerobject) {
        google.maps.event.addListener(markerobject, 'dragend', function (evt) {
          // infoWindow.setOptions({
          //   content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
          // });

          console.log("New latitude: " + evt.latLng.lat());
          console.log("New longitude: " + evt.latLng.lng());
          // clearResults();
          var newLat = evt.latLng.lat();
          var newLng = evt.latLng.lng();
          clearResults();
          runWeatherSearch(newLat, newLng);
          getIceCream(newLat, newLng);

          // infoWindow.open(map, markerobject);
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

// Function to query weatherAPI
function runWeatherSearch(lat, lon) {
  var APIKey = "e830b3369005f2ed76e0b64a133b7186";
  var queryURLWeather = "https://api.openweathermap.org/data/2.5/weather?" +
    "lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;


  $.ajax({
    url: queryURLWeather,
    method: "GET"
  }).then(function (response) {
    clearResults();
    console.log(response);
    var city = response.name;
    // var place = city + " " + state;
    // console.log(state);
    var icon = response.weather[0].icon;
    var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
    var temp = parseInt(response.main.temp);
    var weatherConditions = response.weather[0].main;
    $("#weather-temp").append(city + " " + temp + "<span> &#8457</span>");
    $("#weather-conditions").append("<img class='weather-img' src=" + iconURL + ">  " + 
    "<span class='conditions'>" + weatherConditions + "</span>");
    getState(city, lat, lon);
  });
}


//Find ice cream at current location
function getIceCream(initialLat, initialLng) {
  console.log(initialLat);
  $.ajax({
    type: "GET",
    headers: {
      'user-key': '8851beeb86b413ae8755c9637e970ea1'
    },
    url: 'https://developers.zomato.com/api/v2.1/search?lat=' + initialLat + '&lon=' + 
    initialLng + '&radius=2000&cuisines=233&count=1',
    dataType: 'json',
    processData: true,
    success: function (response) {
      console.log(response);

      var urlIceCream = response.restaurants[0].restaurant.url;

      var nameIceCream = response.restaurants[0].restaurant.name;
      var photoIceCream = response.restaurants[0].restaurant.photos_url;
      $("#ice-cream-title").text("Treat yo'self to:");
      $("#ice-cream-link").attr("href", urlIceCream);
      $("#ice-cream").text(nameIceCream);
      // $(".ice-image").attr("src", photoIceCream);

      console.log(urlIceCream);
      console.log(nameIceCream);
    }
  })
}

function getState(city, initialLat, initialLng) {
  $.ajax({
        type: "GET",
        headers: {
          'user-key': '8851beeb86b413ae8755c9637e970ea1'
        },
        url: 'https://developers.zomato.com/api/v2.1/cities?lat=' + initialLat + '&lon=' + initialLng + '&radius=2000&cuisines=233&count=1',
        dataType: 'json',
        processData: true,
        success: function (response) {
          var state = response.location_suggestions[0].state_name;
          var place = city + " " + state;
          console.log(state);
          runQuerySearch(place);
          currentCity = city;
          currentLat = initialLat;
          currentLng = initialLng;
          
        }
      });
}


// Function to query newsAPI
function runQuerySearch(query) {
  // clearResults();
  console.log(query);
  query = query.replace(/\s/g, "-").toLowerCase();
  var queryURL = 'https://newsapi.org/v2/everything?' +
    'q=' + query + '&' +
    'from=' + getDate + '&' +
    'sortBy=popularity&' +
    'pageSize=5&' +
    'apiKey=aa554aabe02548799f1507bbfa67060e';
    console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "Get"
  }).done(function (response) {
    console.log(response);

    var i;
    var l = response.articles.length;
    for (i = 0; i < l; i++) {
      articleCounter++;
      var longTitle = response.articles[i].title;
      var length = 50;
      var shortTitle = longTitle.substring(0, length);
      console.log(longTitle);
      console.log(shortTitle);
      $("#article-" + articleCounter).find("img").attr("src", response.articles[i].urlToImage);
      $("#article-" + articleCounter).find("span").text(shortTitle + "...");
      $("#article-" + articleCounter).attr("href", response.articles[i].url);
    }
  
  })

}


$("#save-location, #save-location-mobile").on("click", function () {
  var newCity = currentCity;
  var newLat = currentLat;
  var newLng = currentLng;

  dbRef.push({

    locationName : newCity,
    longitude : newLng,
    latitude : newLat,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

  console.log(newCity);
  console.log(newLat);
  console.log(newLng);

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: newLat, lng: newLng },
    zoom: 8

  });
  infoWindow = new google.maps.InfoWindow;

  var posNew = {
    lat: newLat,
    lng: newLng
  };
  console.log(posNew);

  var marker = new google.maps.Marker({
    position: posNew,
    map: map,
    draggable: true,
  });

  //Grab new longitude/latitude from moved marker
  function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
      // infoWindow.setOptions({
      //   content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
      // });

      console.log("New latitude: " + evt.latLng.lat());
      console.log("New longitude: " + evt.latLng.lng());
      // clearResults();
      var newLat = evt.latLng.lat();
      var newLng = evt.latLng.lng();
      clearResults();
      runWeatherSearch(newLat, newLng);
      getIceCream(newLat, newLng);

      // infoWindow.open(map, markerobject);
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
      console.log("marker is being dragged");
    });
  }

  //Call function to capture new location
  markerCoords(marker);
  infoWindow.open(map);
  map.setCenter(posNew);


});

$(document).on("click", ".location-item", function () {
  var newLat = parseFloat($(this).attr("lat-value"));
  var newLng = parseFloat($(this).attr("long-value"));

  clearResults();
  runWeatherSearch(newLat, newLng);
  getIceCream(newLat, newLng);
  console.log(newLat);
  console.log(newLng);
  var map, infoWindow;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: newLat, lng: newLng },
    zoom: 8

  });
  infoWindow = new google.maps.InfoWindow;

  var posNew = {
    lat: newLat,
    lng: newLng
  };

  var marker = new google.maps.Marker({
    position: posNew,
    map: map,
    draggable: true,
  });

  //Grab new longitude/latitude from moved marker
  function markerCoords(markerobject) {
    google.maps.event.addListener(markerobject, 'dragend', function (evt) {
      // infoWindow.setOptions({
      //   content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
      // });

      console.log("New latitude: " + evt.latLng.lat());
      console.log("New longitude: " + evt.latLng.lng());
      // clearResults();
      var newLat = evt.latLng.lat();
      var newLng = evt.latLng.lng();
      clearResults();
      runWeatherSearch(newLat, newLng);
      getIceCream(newLat, newLng);

      // infoWindow.open(map, markerobject);
    });

    google.maps.event.addListener(markerobject, 'drag', function (evt) {
      console.log("marker is being dragged");
    });
  }

  //Call function to capture new location
  markerCoords(marker);
  infoWindow.open(map);
  map.setCenter(posNew);
      

});




//Clears weather input
function clearResults() {
  $("#weather-temp").empty();
  $("#weather-conditions").empty();
  articleCounter = 0;
}


//Initialize map
window.onload = function() {
  initMap();
}



