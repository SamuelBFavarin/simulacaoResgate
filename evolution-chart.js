

var points = [ 12 ];

var config = {
    options: {
        responsive: true,
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true
            }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true
            }
        }]
    },
    type: 'line',
    data: {
        backgroundColor: 'white',
        borderColor: 'black',
        labels: [],
        datasets: [{
            data: [],
            fill: false,
        }]
    }
};


window.onload = function(){
    window.chart = new Chart( document.getElementById("chart").getContext("2d"), config);
};

function addPoint( x, y ){

    config.data.labels.push( x );
    config.data.datasets[0].data.push( y );
    window.chart.update(config);
}
