document.addEventListener('DOMContentLoaded', () => {
    const ctxLine = document.getElementById('LineChart')?.getContext('2d');
    const ctxBar = document.getElementById('BarChart')?.getContext('2d');

    if (ctxLine) {
        const gradientLine = ctxLine.createLinearGradient(0, 0, 0, 400);
        gradientLine.addColorStop(0, '#92FE9D'); // Top color
        gradientLine.addColorStop(1, '#00C9FF'); // Bottom color

        new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Sales",
                    data: [0, 5, 15, 25, 40, 45, 50, 70, 80, 90, 95, 98],
                    borderColor: '#00C9FF',
                    borderWidth: 5,
                    backgroundColor: gradientLine,
                    pointBackgroundColor: '#92FE9D',
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    tension: 0.4,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false
                    },
                },
                hover: {
                    mode: 'nearest',
                    intersect: false
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    if (ctxBar) {
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales',
                    data: [10, 30, 40, 50, 60, 100],
                    backgroundColor: '#00C9FF',
                    borderRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false
                    },
                },
                hover: {
                    mode: 'nearest',
                    intersect: false
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
