// Get the value from the URL query parameter
let urlParams = new URLSearchParams(window.location.search);
let calculatedValue = urlParams.get("value");

calculatedValue = Number(calculatedValue);
calculatedValue = calculatedValue.toFixed(2);
tree = calculatedValue*40;
tree = tree.toFixed(2);

// Display the calculated result on the page
let resultElement = document.getElementById("Result");
resultElement.textContent = calculatedValue;

let treeElement = document.getElementById("tree");
treeElement.textContent = tree;

let usage = document.getElementById("usage");
if (calculatedValue <= 12) {
    usage.textContent = "Low usage";
    usage.style.color = "lightgreen";
}
else if (calculatedValue > 12 && calculatedValue <= 22) {
    usage.textContent = "Medium usage";
    usage.style.color = "lightyellow";
}
else {usage.textContent = "High usage";
    usage.style.color = "lightsalmon";}