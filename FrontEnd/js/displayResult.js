// Get the value from the URL query parameter
let urlParams = new URLSearchParams(window.location.search);
let calculatedValue = urlParams.get("value");

// Display the calculated result on the page
let resultElement = document.getElementById("Result");
resultElement.textContent = calculatedValue;

let treeElement = document.getElementById("tree");
treeElement.textContent = calculatedValue*0.0005*40;