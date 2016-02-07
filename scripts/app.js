$(document).ready(function(){
	initEvents();

	$.event.trigger('loading.app', true);

	Data.load('https://raw.githubusercontent.com/deeptowncitizen/homicide-visualize/master/data/Homicides_by_firearms.csv')
							.then(function(data){
								start(data);
								$.event.trigger('loading.app', false);
							}, function(error){
								console.log(error);
								$.event.trigger('error.app', {
									title: error.title,
									text: error.text,
									terminate: true});
							});
});

function start(csvData) {
	var app = new App(csvData);
	app.addPanel("title");

	$('button[type=submit]').click(function(){
		app.addPanel("title");
	});

	/*var yearDictData = Data.csvDataToDateDict(csvData);
	var labels = ['x', 'A'];
	var data = [];
	var index = 1;
	for(var year in yearDictData) {
		var item = [];
		var percentSum = 0;
		for(var i = 0; i < yearDictData[year].length; i++) {
			if (!yearDictData[year][i].percentageHomicidesByFirearms)
				continue;
			percentSum += yearDictData[year][i].percentageHomicidesByFirearms;
		}
		var avg = percentSum / yearDictData[year].length;
		item.push(new Date('' + year + '/12/13'));
		item.push(avg);
		data.push(item);

		if (item.length != 2)
			throw year;
	}

	var chartOptions = new Graph.ChartOptions();
	chartOptions.selector = '.app';
	var chart = new Graph.Chart(chartOptions);
	chart.draw(data, labels);*/
}

function App(csvData) {
	var _chartId = 0;
	var _csvData = csvData;
	var _panels = [];

	function initDashboard() {
		$( ".column" ).sortable({
			connectWith: ".column",
			handle: ".panel-heading",
			//cancel: ".portlet-toggle",
			placeholder: "panel-placeholder ui-corner-all"
		});

		$('.dashboard').on('click', '.close-panel', (function(e){
			var id = $(this).closest('.panel').attr('data-panel-id');
			id = parseInt(id);
			_panels = $.grep(_panels, function(e, i){
				if (e.getId() == id) {
					e.close();
					return false;
				}

				return true;
			});
		}));

		$('.clear-dashboard').click(function(){
			closeAllPanels();
		});
	}

	function closeAllPanels(){
		$.each(_panels, function(i, e){ e.close(); });
		_panels = [];
	}

	function getNextColumn() {
		var result = [];
		$('.column').each(function(i, e){
			var count = $(this).find('.panel').size();
			result.push({column: $(this), size: count});
		});

		result.sort(function(a, b){
			return a.size < b.size ? -1 : (a.size > b.size ? 1 : 0);
		});

		return result[0].column;
	}

	this.getNextChartId = function(){ return ++_chartId; }
	
	this.addPanel = function(title){
		var panel = new Panel(this.getNextChartId(), title, getNextColumn());
		_panels.push(panel);
	};

	this.start = function() {

	};

	initDashboard();
}

function Panel(id, title, parent) {
	var _data = {
		id: id,
		title: title
	};
	var _parent = parent;

	var ctor = function() {
		$( "#dashboard-panel" )
			.tmpl( _data )
			.appendTo( _parent );
	};

	this.close = function() {
		$(parent).find('.panel[data-panel-id=' + _data.id + ']').remove();
	}

	this.getId = function(){ return _data.id; }

	ctor();
}




function initEvents() {
	$(document).on('terminate.app', function(e, arg){
		$.event.trigger('loading.app', false);
		$('#app-terminate .panel-title').text(arg.title);
		$('#app-terminate .panel-body').text(arg.text);
		$('#app-terminate').toggleClass('hidden');
	});

	$(document).on('loading.app', function(e, state){
		if (state)
			$('.loading').show();
		else
			$('.loading').hide();
	});

	$(document).on('error.app', function(e, info){
		toastr.error(info.text, info.title);
		if (info.terminate)
			$.event.trigger('terminate.app', info);
	});
}