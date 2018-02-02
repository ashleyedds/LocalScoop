var articleCounter = 0;
var getDate = moment().subtract(7, "days").format("YYYY-MM-DD");
var currentCity;
var currentLat;
var currentLng;
var placeClick = false;

$('.carousel').carousel();
$(".dropdown-button").dropdown();

function initMap() {
  var map, infoWindow;
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8
    
  });
  infoWindow = new google.maps.InfoWindow;
  

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
      // getState(initialLat, initialLng);
      clearResults();
      runWeatherSearch(initialLat, initialLng);
      getIceCream(initialLat, initialLng);


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
          // clearResults();
          var newLat = evt.latLng.lat();
          var newLng = evt.latLng.lng();
          clearResults();
          runWeatherSearch(newLat, newLng);
          getIceCream(newLat, newLng);

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


$("#link2").on("click", function() {
  var newCity = currentCity;
  var newLat = currentLat;
  var newLng = currentLng;
  placeClick = true;
  initMap();
  console.log(newCity);
})


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





// function CenterControl(controlDiv, map) {

//   // Set CSS for the control border.
//   var controlUI = document.createElement('div');
//   controlUI.style.backgroundColor = 'rgb(240,98,146)';
//   controlUI.style.border = '2px solid #fff';
//   controlUI.style.borderRadius = '3px';
//   controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
//   controlUI.style.cursor = 'pointer';
//   controlUI.style.marginBottom = '22px';
//   controlUI.style.textAlign = 'center';
//   controlUI.title = 'Scoop Again';
//   controlDiv.appendChild(controlUI);

//   // Set CSS for the control interior.
//   var controlText = document.createElement('div');
//   controlText.style.color = '#fff';
//   controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
//   controlText.style.fontSize = '16px';
//   controlText.style.lineHeight = '38px';
//   controlText.style.paddingLeft = '5px';
//   controlText.style.paddingRight = '5px';
//   controlText.innerHTML = 'Scoop Again';
//   controlUI.appendChild(controlText);

//   // Setup the click event listeners: simply set the map to Chicago.
//   controlUI.addEventListener('click', initMap());
// }


// function initMapNew(lat, lng) {
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 6,
//     center: { lat: "", lng: "" }
//   });
  

//   var marker = new google.maps.Marker({
//     map: map,
//     // Define the place with a location, and a query string.
//     place: {
//       location: { lat: 35.8564364, lng: -78.8439157 },
//       query: 'Google, Morrisville, NC'

//     },
//     // Attributions help users find your site again.
//     attribution: {
//       source: 'Google Maps JavaScript API',
//       webUrl: 'https://developers.google.com/maps/'
//     }
//   });

//   // Construct a new InfoWindow.
//   var infoWindow = new google.maps.InfoWindow({
//     content: 'Saved Place Name'
//   });

//   // Opens the InfoWindow when marker is clicked.
//   marker.addListener('click', function () {
//     infoWindow.open(map, marker);

//   });
//   var centerControlDiv = document.createElement('div');
//   var centerControl = new CenterControl(centerControlDiv, map);

//   centerControlDiv.index = 1;
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
// }



