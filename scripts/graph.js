var graph = (function(){
	function ChartOptions() {
        this.title = '';
		this.options = {};
		this.labels = [];
		this.data = {};
	}

	function Chart(chartOptions){
		var options = chartOptions;
		var _graph = null;

		this.draw = function(parent){
            var graphOptions = {
                    labels: [],
                    legend: 'always',
                    title: '',
                    titleHeight: 32,
                    ylabel: '',
                    xlabel: '',
                    labelsDivStyles: {
                        'text-align': 'right',
                        'background': 'none'
				    } ,
                    strokeWidth: 1.5
                };
                
            $.extend(graphOptions, options.options);
            
			_graph = new Dygraph(parent, options.data, graphOptions);
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