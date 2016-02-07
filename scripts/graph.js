var Graph = (function(){
	function ChartOptions() {
		this.width = 0;
		this.height = 0;
		this.selector = '';
	}

	function Chart(chartOptions){
		var options = chartOptions;

		this.draw = function(data, labels){
			new Dygraph($(options.selector)[0],
              data,
              {
                labels: labels,
                legend: 'always',
				title: 'Some title',
				titleHeight: 32,
				ylabel: 'Homicide Avg, %',
				xlabel: 'Year',
				labelsDivStyles: {
				'text-align': 'right',
				'background': 'none'
				},
				strokeWidth: 1.5
              }).resize(1400, 1000);
		};
	}

	return {
		Chart: Chart,
		ChartOptions: ChartOptions,
	};
})();