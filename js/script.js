const apiKey = 'c3f4a8d9e2dcb57f37a039d7f70a0c1a';

var cityInput = document.querySelector('#cityInput');
var cityButton = document.querySelector('#cityButton');
var sideNav = document.querySelector('#sideNav');

// Read the stored previous searches from the localStorage
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];
var currentCoords = {
    lat: 0,
    lon: 0
};

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

var updateWeatherDisplay = function(data) {

}

var getWeatherData = function (city_name) {
    // Use the openweather API to query for lat / lon based on city name.
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city_name + '&limit=1&appid=' + apiKey)
        .then((response) => {
            return response.json();
        }).then( (data) => {
            console.log(data[0]);
            //Get the current weather
            fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + data[0].lat + '&lon=' + data[0].lon + '&appid=' + apiKey)
            .then( (response) => {
                return response.json();
            }).then( (data) => {
                console.log(data);
                updateWeatherDisplay(data);
            })
        })
}


var cityButtonClick = function () {
    console.log(cityInput.value);
    cityArray.push(cityInput.value);
    localStorage.setItem('cityArray', JSON.stringify(cityArray));
    updateSideNav();
    getWeatherData(cityInput.value);

}

var cityUlClick = function (event) {
    if (event.target.tagName === 'BUTTON') {
        console.log(event.target.textContent);
        getWeatherData(event.target.textContent);
    }
}

cityButton.addEventListener('click', cityButtonClick);
sideNav.addEventListener('click', cityUlClick);