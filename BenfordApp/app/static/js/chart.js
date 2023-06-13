var chartOptions = {
		chart: {
			type: 'column'
		},
    title: {
        text: 'Benford Analysis',
    },
    xAxis: {
    },
    yAxis: {
        title: {
            text: 'Distribution %'
        }
    },
    plotOptions: {
        series: {
            pointStart: 1
        }
    },
    series: [{
        name: 'Benford Curve',
        data: [30.1,17.6,12.5,9.7,7.9,6.7,5.8,5.1,4.6]
    	}, {
        name: 'Selected Column',
        data: [0,0,0,0,0,0,0,0,0]
    	},
    ]
};
