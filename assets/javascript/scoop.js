

    var articleCounter = 0;

    var getDate = moment().format("YYYY-MM-DD");
    console.log(getDate);
    // Function to query newsAPI
        function runQuerySearch(query) {
            console.log(query);
            var queryURL = 'https://newsapi.org/v2/everything?' +
            'q=' + query + '&' +
            'from=' + getDate + '&' +
            'sortBy=popularity&' +
            'pageSize=3&' +
            'apiKey=aa554aabe02548799f1507bbfa67060e';
        
            $.ajax({
            url: queryURL,
            method: "Get"
            }).done(function(response) {
            console.log(response);
            for (i = 0; i < response.articles.length; i++) {
                console.log(response.articles[i].title);
                articleCounter++;
                var colDiv = $("<div>");
                colDiv.addClass("col s4");
                $("#row-section").append(colDiv);
                var cardMainDiv = $("<div>");
                cardMainDiv.addClass("card blue-grey lighten-2 z-depth-4");
                colDiv.append(cardMainDiv);
                var contentDiv = $("<div>");
                contentDiv.addClass("card-content white-text");
                contentDiv.attr("id", "article-card-" + articleCounter);
                cardMainDiv.append(contentDiv);
                $("#article-card-" + articleCounter).append(
                    // "<img class='article-img' src='" + response.articles[i].urlToImage + "' alt='image'>" + 
                "<a href='" + response.articles[i].url + "'>" + "<span class='card-title'>" + response.articles[i].title + "</span>" + "</a>" +
                "<p>" + response.articles[i].description + "</p>");
                };

            });
        };
    
    // Function to query weatherAPI
        function runWeatherSearch(lat, lon) {
          var APIKey = "e830b3369005f2ed76e0b64a133b7186";
          var queryURLWeather = "https://api.openweathermap.org/data/2.5/weather?" +
                    "lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;
      
      
            $.ajax({
                url: queryURLWeather,
                method: "GET"
            }).then(function(response) {
                var weatherWell = $("<div>");
                weatherWell.addClass("card");
                weatherWell.attr("id", "weather-card");
                $("#weather-main").prepend(weatherWell);
                $("#weather-card").append("<span class='card-title'>Current temperature: " + response.main.temp + "</span>");
                var cityName = response.name;
                runQuerySearch(cityName);
            });
        };

        function clearResults() {
            $("#row-section").empty();
        }
    
    // Function get users input
        $("#run-search").on("click", function(event) {
    
            event.preventDefault();
          
            var searchTerm = $("#search-term").val().trim();
            var weatherSearch = searchTerm;
            searchTerm = searchTerm.replace(/\s/g, "-").toLowerCase();
            var query;
            query = searchTerm;
            console.log(searchTerm);
         
            runQuerySearch(query);
            runWeatherSearch(weatherSearch);
          
        });
    
    //Function clear data
        $("#clear-all").on("click", function() {
            articleCounter = 0;
            $("#well-section").empty();
            $(".form-control").val("");
        });
    
    
    
    
    //Initialize map
    var map, infoWindow;
    
    function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
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
          runWeatherSearch(initialLat, initialLng);
    
    
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
              clearResults();
              var newLat = evt.latLng.lat();
              var newLng = evt.latLng.lng();
              runWeatherSearch(newLat, newLng);
    
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