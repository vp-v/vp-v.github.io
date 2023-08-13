function populateDropdownWithData() {
    fetch('https://onboarding-ta21-3.azurewebsites.net/api/get_data')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('dropdown');
            dropdown.innerHTML = '<option value="option0">----</option>';

            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.postcode;
                option.innerText = item.postcode;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

window.onload = function() {
    populateDropdownWithData();
    const dropdown = document.getElementById('dropdown');
    const resultDiv = document.getElementById('graph');
    var ctx = document.getElementById('myChart').getContext('2d');

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['You', 'Your Neighbors'],
            datasets: [{
                label: 'Your Carbon Footprint',
                data: [0, 0],
                backgroundColor: [
                    'rgba(255, 255, 255, 0.8)',
                    'rgba(0, 255, 0, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 255, 255, 1)',
                    'rgba(0, 255, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        color: 'white',
                        fontSize: 18,
                        fontStyle: 'bold'
                    }
                },
                title: {
                    display: true,
                    text: 'Carbon Footprint',
                    color: 'white',
                    fontSize: 22,
                    fontStyle: 'bold'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white',
                        fontSize: 18,
                        fontStyle: 'bold'
                    }
                },
                x: {
                    ticks: {
                        color: 'white',
                        fontSize: 18,
                        fontStyle: 'bold'
                    }
                }
            }
        }
    });

    // dropdown.addEventListener('change', function() {
    //     const selectedOption = dropdown.value;
    //     var newData;
    //     var newLabel;
    //     if (selectedOption === 'option1') {
    //         newData = [localStorage.getItem('calculatedValue'), 1];
    //         newLabel = '3168';
    //     } else if (selectedOption === 'option2') {
    //         newData = [localStorage.getItem('calculatedValue'), 2];
    //         newLabel = '1234';
    //     } else if (selectedOption === 'option3') {
    //         newData = [localStorage.getItem('calculatedValue'), 3];
    //         newLabel = '5678';
    //     } else if (selectedOption === 'option4') {
    //         newData = [localStorage.getItem('calculatedValue'), 4];
    //         newLabel = '6666';
    //     } else {
    //         newLabel = 'Your Neighbors';
    //     }
    //
    //     myChart.data.labels[1] = newLabel;
    //     myChart.data.datasets[0].data = newData;
    //     myChart.update();
    // });
    dropdown.addEventListener('change', function() {
        const selectedPostcode = dropdown.options[dropdown.selectedIndex].text;

        fetch('https://onboarding-ta21-3.azurewebsites.net/api/get_data')
            .then(response => response.json())
            .then(data => {
                let selectedData = data.find(item => item.postcode === selectedPostcode);

                if (selectedData) {
                    let newData = [localStorage.getItem('calculatedValue'), selectedData.emissions];
                    myChart.data.labels[1] = selectedData.name;
                    myChart.data.datasets[0].data = newData;
                    myChart.update();
                }
            });
    });

};
