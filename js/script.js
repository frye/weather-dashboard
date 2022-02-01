const apiKey = 'c3f4a8d9e2dcb57f37a039d7f70a0c1a';

var cityInput = document.querySelector('#cityInput');
var cityButton = document.querySelector('#cityButton');
var sideNav = document.querySelector('#sideNav');

// Read the stored previous searches from the localStorage
var cityArray = JSON.parse(localStorage.getItem('cityArray')) || [];

// Function to populate list of previously searched forecasts
var updateSideNav = function() {
    // Sorting the history alphabetically for easier reading.
    cityArray.sort();
    sideNav.innerHTML = '';
    for (var i=0; i < cityArray.length; i++) {
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




var cityButtonClick = function() {
    console.log(cityInput.value);
    cityArray.push(cityInput.value);
    localStorage.setItem('cityArray', JSON.stringify(cityArray));
    updateSideNav();
}

var cityUlClick = function(event) {
    if (event.target.tagName === 'BUTTON') {
        console.log(event.target.textContent);
    }
}

cityButton.addEventListener('click', cityButtonClick);
sideNav.addEventListener('click', cityUlClick);