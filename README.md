LocalScoop

Description: LocalScoop is a groundbreaking, location-based news app that provides the most up-to-date news articles from over 5,000 top news sources like New York Times, Associated Press, and The BBC relevant to your current position. While you’re browsing news articles relevant to you, you can also keep a check on the current weather and, because everyone loves to have a treat while they consume their news, have a link that will lead you to the nearest ice cream shop! LocalScoop isn’t confined to your current position, you can search news relevant to anywhere in the world and save your favorite locations to check later.

Motivation: Are you like me, always craving ice cream? And like the responsible citizen you are, you no doubt like to stay informed with current news articles about happenings near you and in locations that are near and dear to your heart. How often do you find yourself surfing news sites and can’t focus on the articles, because your craving for ice cream is so INTENSE, but you’re not sure where the closest ice cream shop is? FEAR NO MORE. LocalScoop has got your back.

Result: Using Firebase, Google Maps API Geolocation API, Zomato API, OpenWeatherMap API, News API, Moment JS, and Materialize to wrap it in a pretty bow, we created an app displays current news articles relevant to the user’s current location and also shares the current weather and nearest ice cream shop. Users can also select different locations across the US and, through their own account, save favorite locations for easy access later.

Team Efforts:
Joseph Quinn: Our front-end UI mastermind.
Ashley Edds, Matthew Morford: The API dream team. Ashley focused primarily on Google Maps Geolocation API and the Zomato API. Matt worked on News and OMW API, along with JS for displaying news, weather, and ice cream results on screen.
Dawn Wages: The Firebase guru

Individual Responsibilities:
Ashley: 
	--Using Google Maps API’s Geolocation feature, wrote a function to initialize the first map which renders with the user’s current location. This function grabs the current latitude and longitude, and uses these to run functions to pull the current weather and nearest ice cream shop.
	--Using Google Maps API, created a variable to render a “marker” to display the user’s current location (or desired location) and enabled the marker to be “draggable” for the user to update to a location of interest. Moving the marker updates the longitude and latitude, so the other ajax calls can be completed.
	--Using Google Maps API, wrote a function to grab the current latitude and longitude of the marker “on click” to save the location for later use.
	--Using the Zomato API, write an ajax call to determine closest ice cream shop using the longitude and latitude values grabbed from Google Maps.
	--Designed the LocalScoop logo

Matt:
  	 --OpenWeatherMap API, function to run ajax call for getting results based on current latitude and longitude. Javascript to display City Temperature, conditions and current weather icon in html. 
  	 --News API, function to run ajax call for getting local news results based on city and state name.  Javascript to display article image and title along with link to article in html. 
  	---Added to Zomato API function to display nearest Ice Cream results in html.
  	 --On click function for saving place, clear function for removing results when changing current place. 

Joe: 
	--MaterializeCSS design and layout for main and login pages, as well as custom stylesheet to bend Materialize to suit our needs best. 

Dawn: 
	-- Firebase User Auth: log in, log out, create user, add, delete and edit user specific data

Challenges:
	--Google Places API
		To find the nearest ice cream shop, we attempted to use the Google Places API because it would have worked nicely with the Geolocation feature. Unfortunately, Google Places wasn’t CORS friendly, and we weren’t prepared for that in the timeframe of this project. Instead, we found Zomato, which allowed us to do a “place” search using latitude and longitude.
	--Asynchronous AJAX
		When running the AJAX calls, the AJAX call to retrieve the state would not complete before the news search, which requires the state, would finish its run. To solve this, we chained the AJAX calls together--the calls were placed within a function, and the function to run the call would be attached to the completion of other AJAX calls.
	--Learning GitHub
		It’s just scary. Big shout out to the TAs and the “restore branch” buttons.
	--More specific search terms
		When running the News API, we used the “city name” from the weather API (the News API would not accept latitude and longitude to search). This works, but often times, there are cities of the same name in multiple states. To make the search more specific to the desired location of search, we had to use a separate AJAX call to Zomato, which would give us a state, and use that + the city name to run the news search.
	--Rendering updated Google Map from saved locations
		Initially, when attempting to render a map which displayed a saved latitude and longitude in a new map, which then utilized that same latitude and longitude to run all the AJAX calls. With the script tag in the HTML running the “initialize map” function, the geolocation was overriding any further map renders. By removing the “initialize map” call back function and “asynchronous defer” from the script tag in the html and attaching a new map render to “onclick”, we were able to render new maps as needed.”


Improvements:
	--International search capabilities
		Currently, the search only works well within the US given the city and state search criteria 
	--True mobile functionality
	--User profile page
	--More sophisticated log in / sign-up process
	
