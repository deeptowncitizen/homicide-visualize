var Graph = (function(){
	function ChartOptions() {
		this.yLabel = '';
		this.xLabel = '';
		this.labels = [];
		this.data = {};
	}

	function Chart(chartOptions){
		var options = chartOptions;
		var _graph = null;
//$(options.selector)[0]
		this.draw = function(parent){
			_graph = new Dygraph(parent,
              options.data,
              {
                labels: options.labels,
                legend: 'always',
				title: '',
				titleHeight: 32,
				ylabel: options.xLabel,
				xlabel: options.yLabel,
				labelsDivStyles: {
					'text-align': 'right',
					'background': 'none'
				},
				strokeWidth: 1.5
              });
			_graph.resize();
		};

		this.resize = function(w, h) {
			if (_graph == null)
				return;

			_graph.resize(w, h);
		};
	}

	return {
		Chart: Chart,
		ChartOptions: ChartOptions,
	};
})();