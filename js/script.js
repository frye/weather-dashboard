const apiKey = 'c3f4a8d9e2dcb57f37a039d7f70a0c1a';

var cityInput = document.querySelector('#cityInput');
var cityButton = document.querySelector('#cityButton');
var sideNav = document.querySelector('#sideNav');

var cityButtonClick = function() {
    console.log(cityInput.value);
}

cityButton.addEventListener('click', cityButtonClick);