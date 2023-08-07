window.onload = function() {
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

    dropdown.addEventListener('change', function() {
        const selectedOption = dropdown.value;
        // resultDiv.textContent = `You selected: ${selectedOption}, the result is:`;
        var newData;
        if (selectedOption === 'option1') {
            newData = [localStorage.getItem('calculatedValue'), 1];
        } else if (selectedOption === 'option2') {
            newData = [localStorage.getItem('calculatedValue'), 2];
        } else if (selectedOption === 'option3') {
            newData = [localStorage.getItem('calculatedValue'), 3];
        } else {
            newData = [localStorage.getItem('calculatedValue'), 4]
        }
        myChart.data.datasets[0].data = newData;
        myChart.update();
    });
};
