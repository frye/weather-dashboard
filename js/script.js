const apiKey = 'c3f4a8d9e2dcb57f37a039d7f70a0c1a';
const NUM_FORECASTS = 5;

var cityInput = document.querySelector('#cityInput');
var cityButton = document.querySelector('#cityButton');
var sideNav = document.querySelector('#sideNav');
var currentWeather = document.querySelector('#currentWeather');
var forecastWeather = document.querySelector('#forecastWeather');

// Read the stored previous searches from the localStorage
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];
var currentCity = localStorage.getItem('currentCity') || 'Seattle';
var currentCoords = {
    lat: 0,
    lon: 0
};
var timeZoneOffset = 0;

var init = function() {
    if (currentCity) {
        getWeatherData(currentCity);
    }
}

// Function to populate list of previously searched forecasts
var updateSideNav = function () {
    // Sorting the history alphabetically for easier reading.
    cityArray.sort();
    sideNav.innerHTML = '';
    for (var i = 0; i < cityArray.length; i++) {
        var element = document.createElement('li');
        element.classList.add('d-flex', 'pb-1');
        var button = document.createElement('button');
        var deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'w-25', 'delete');
        deleteBtn.innerHTML = 'X';
        button.textContent = cityArray[i];
        button.classList.add('btn', 'btn-primary', 'w-75');
        element.appendChild(button);
        element.appendChild(deleteBtn);
        sideNav.classList.add('custom-list');
        sideNav.appendChild(element);
    }
}

// Create the buttons for fast navigation back to previously searched data.
if (cityArray) {
    console.log(cityArray);
    updateSideNav();
}

var getUvIndexColor = function (uvi) {
    if ( uvi < 3 ) {
        return 'green';
    } else if ( uvi < 6 ) {
        return 'yellow';
    } else {
        return 'red';
    }
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
    var icon = document.createElement('img');
    icon.setAttribute('src',`https://openweathermap.org/img/w/${data.weather[0].icon}.png`);

    // Calculate UV Index color
    var color = getUvIndexColor(data.uvi);

    // Add the data 
    cardTitle.textContent = `${currentCity} ${new Date((data.dt + timeZoneOffset) * 1000).toLocaleDateString()}`;
    cardTitle.append(icon);
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

var createCard = function (data) {
    // Create card elements
    var cardDiv = document.createElement('div');
    var cardImg = document.createElement('img');
    var cardBody = document.createElement('div');
    var cardHdr = document.createElement('h3');
    var cardTemp = document.createElement('p');
    var cardWind = document.createElement('p');
    var cardHumi = document.createElement('p');

    //style
    cardDiv.classList.add('card', 'col-12', 'col-sm-4', 'col-lg-3', 'custom-card', 'bg-light', 'm-1', 'border-3');
    cardImg.classList.add('card-img-top', 'weather-icon');
    cardBody.classList.add('card-body');
    cardHdr.classList.add('card-title');

    // Set the data, both icon filename and timezone offset are picked from the response.
    cardImg.setAttribute('src', `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    // Calculate the correct time based off of the timezone offset and returned UTC time. 
    // First do the unix time math, then multiply by 1000 to get milliseconds for new Date()
    cardHdr.textContent = new Date((data.dt + timeZoneOffset) * 1000).toLocaleDateString();
    cardTemp.textContent = `Temp: ${Math.ceil(data.temp.max)}°F`;
    cardWind.textContent = `Wind: ${data.wind_speed}MPH`;
    cardHumi.textContent = `Humidity: ${data.humidity}%`;


    // Add elements to card div and return the card.
    cardDiv.appendChild(cardImg);
    cardBody.appendChild(cardHdr);
    cardBody.appendChild(cardTemp);
    cardBody.appendChild(cardWind);
    cardBody.appendChild(cardHumi);

    cardDiv.appendChild(cardBody);

    return cardDiv;
}

var drawForecast = function (data) {
    forecastWeather.innerHTML = ''
    for (var i = 1; i <= NUM_FORECASTS; i++) {
        console.log(data[i]);
        var card = createCard(data[i]);
        forecastWeather.appendChild(card);
    }

}

var updateWeatherDisplay = function (data) {
    timeZoneOffset = data.timezone_offset;
    console.log(timeZoneOffset);
    drawCurrent(data.current);
    drawForecast(data.daily);
}

var getWeatherData = function (city_name) {
    // Use the openweather API to query for lat / lon based on city name.
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city_name + '&limit=1&appid=' + apiKey)
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
    localStorage.setItem('currentCity', currentCity);
    console.log(currentCity);
    cityArray.push(currentCity);
    localStorage.setItem('cityArray', JSON.stringify(cityArray));
    updateSideNav();
    getWeatherData(currentCity);

}

var cityUlClick = function (event) {
    if (event.target.tagName === 'BUTTON') {
        if (event.target.classList.contains('delete')) {
            var city = event.target.parentNode.children[0].textContent;
            if (cityArray.includes(city)) {
                var index = cityArray.indexOf(city);
                cityArray.splice(index, 1);
                localStorage.setItem('cityArray', JSON.stringify(cityArray));
                updateSideNav();
            }
        } else {
            currentCity = event.target.textContent;
            localStorage.setItem('currentCity', currentCity);
            console.log(currentCity);
            getWeatherData(currentCity);
        }
    }
}

// Handle enter key press the same way as clicking the get forecast button.
var handleEnter = function(event) {
    if (event.keyCode === 13) {
        cityButtonClick();
    }
}

cityButton.addEventListener('click', cityButtonClick);
sideNav.addEventListener('click', cityUlClick);
cityInput.addEventListener('keyup', handleEnter);

init();