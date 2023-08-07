const dropdown = document.getElementById('dropdown');
const resultDiv = document.getElementById('graph');

dropdown.addEventListener('change', function() {
    const selectedOption = dropdown.value;
    resultDiv.textContent = `You selected: ${selectedOption}`;
});