// Get the value from the URL query parameter
var urlParams = new URLSearchParams(window.location.search);
var calculatedValue = urlParams.get("value");

// Display the calculated result on the page
var resultElement = document.getElementById("Result");
resultElement.textContent = calculatedValue;
