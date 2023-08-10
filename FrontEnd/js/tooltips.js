const tooltip1 = document.getElementById('tooltip1');
const electricityInput = document.querySelector('.electricity');
const tooltip2 = document.getElementById('tooltip2');
const gasInput = document.querySelector('.gas');

electricityInput.addEventListener('focus', () => {
    tooltip1.style.display= 'block';
});

electricityInput.addEventListener('blur', () => {
    tooltip1.style.display = 'none';
});

gasInput.addEventListener('focus', () => {
    tooltip2.style.display= 'block';
});

gasInput.addEventListener('blur', () => {
    tooltip2.style.display = 'none';
});

