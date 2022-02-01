const apiKey = 'c3f4a8d9e2dcb57f37a039d7f70a0c1a';

var cityInput = document.querySelector('#cityInput');
var cityButton = document.querySelector('#cityButton');
var sideNav = document.querySelector('#sideNav');
var currentWeather = document.querySelector('#currentWeather');
var forecastWeather = document.querySelector('#forecastWeather');

// Read the stored previous searches from the localStorage
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];
var currentCoords = {
    lat: 0,
    lon: 0
};
var currentCity = '';

// Function to populate list of previously searched forecasts
var updateSideNav = function () {
    // Sorting the history alphabetically for easier reading.
    cityArray.sort();
    sideNav.innerHTML = '';
    for (var i = 0; i < cityArray.length; i++) {
        var element = document.createElement('li');
        var button = document.createElement('button');
        button.textContent = cityArray[i];
        element.appendChild(button);
        sideNav.appendChild(element);
    }
}

// Create the buttons for fast navigation back to previously searched data.
if (cityArray) {
    console.log(cityArray);
    updateSideNav();
}

var getUvIndexColor = function(uvi) {
    return 'green';
}

var drawCurrent = function (data) {
    //Clear eisting weather data.
    currentWeather.innerHTML = '';

    //Create the elements
    var cardTitle = document.createElement('h2');
    var temp = document.createElement('p');
    var wind = document.createElement('p');
    var humidity = document.createElement('p');
    var uvindex = document.createElement('p');

    // Calculate UV Index color
    var color = getUvIndexColor(data.uvi);

    // Add the data 
    cardTitle.textContent = currentCity;
    temp.textContent = `Temp: ${Math.ceil(data.temp)}°F`;
    wind.textContent = `Wind: ${data.wind_speed}MPH`;
    humidity.textContent = `Humidity: ${data.humidity}%`;
    uvindex.innerHTML = `UV index: <span class='${color}'>${data.uvi}</span>`;

    // Add elements to the page
    currentWeather.appendChild(cardTitle);
    currentWeather.appendChild(temp);
    currentWeather.appendChild(wind);
    currentWeather.appendChild(humidity);
    currentWeather.appendChild(uvindex);
}

var createCard = function(data) {
    // Create card elements
    var cardDiv = document.createElement('div');
    var cardImg = document.createElement('img');
    var cardBody= document.createElement('div');
    var cardHdr = document.createElement('h3');
    var cardTemp= document.createElement('p');
    var cardWind= document.createElement('p');
    var cardHumi= document.createElement('p');

    // Set the data
    // cardImg.setAttribute('src', `http://openweathermap.org/img/w/${data[i].weather[0].icon}.png`)
    
    return cardDiv;
}

var drawForecast = function (data) {
    for (var i=0; i < data.length; i++) {
        console.log(data[i]);
        var card = createCard(data[i]);
        forecastWeather.appendChild(card);
    }
    
}

var updateWeatherDisplay = function (data) {
    drawCurrent(data.current);
    drawForecast(data.daily);
}

var getWeatherData = function (city_name) {
    // Use the openweather API to query for lat / lon based on city name.
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city_name + '&limit=1&appid=' + apiKey)
        .then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data[0]);
            //Get the current weather
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + apiKey)
                .then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    updateWeatherDisplay(data);
                })
        })
}


var cityButtonClick = function () {
    currentCity = cityInput.value;
    console.log(currentCity);
    cityArray.push(currentCity);
    localStorage.setItem('cityArray', JSON.stringify(cityArray));
    updateSideNav();
    getWeatherData(currentCity);

}

var cityUlClick = function (event) {
    if (event.target.tagName === 'BUTTON') {
        currentCity = event.target.textContent;
        console.log(currentCity);
        getWeatherData(currentCity);
    }
}

cityButton.addEventListener('click', cityButtonClick);
sideNav.addEventListener('click', cityUlClick);