$(document).ready(function(){
	initEvents();

	$.event.trigger('loading.app', true);

	series.load('https://raw.githubusercontent.com/deeptowncitizen/homicide-visualize/master/data/Homicides_by_firearms.csv')
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

function start(data) {
	var app = new App(data);
    app.loadPreset(0);

	$('button[type=submit]').click(function(e){
        var id = parseInt($('#presets-list').select2('data')[0].id);
        if ($.isNumeric(id))
		  app.loadPreset(id);
		e.preventDefault();
	});
}

function App(data) {
	var _chartId = 0;
	var _data = data;
    var _yearDictData = data.getCsvDataByYear();
	var _panels = [];
    var _presets = presets.load(_data);

	function initDashboard() {
		$( ".column" ).sortable({
			connectWith: ".column",
			handle: ".panel-heading",
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
			e.preventDefault();
		}));

		$('.clear-dashboard').click(function(e){
			closeAllPanels();
			e.preventDefault();
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
	
	this.addPanel = function(title, chart){
		var panel = new Panel(this.getNextChartId(), title, getNextColumn());
		_panels.push(panel);

		panel.drawChart(chart);
	};
    
    this.loadPreset = function(index) {
        var preset = _presets[index];
        if (!preset)
            $.event.trigger("error.app", {title: 'Invalid preset Id', text: 'Preset Id = ' + index});
            
        var chartOptions = new graph.ChartOptions();
        chartOptions.title = preset.getTitle();
        chartOptions.options = preset.getOptions();
        chartOptions.data = preset.getData(_data);
        var chart = new graph.Chart(chartOptions);
        
        this.addPanel(preset.getTitle(), chart);
    };

	function ctor() {
        initDashboard();
        $('.presets-list').find('option').remove();
        $.each(_presets, function(i, e){
           $("#presets-list").append($('<option></option>').attr("value", i).text(e.getTitle()));
        });
        $('#presets-list').select2({ containerCssClass : "span3" });
    }
    
    ctor();
}

function Panel(id, title, parent) {
	var _data = {
		id: id,
		title: title
	};
	var _parent = parent;
	var _chart = null;
	var _self = null;

	var ctor = function() {
		$( "#dashboard-panel" )
			.tmpl( _data )
			.appendTo( _parent );

		_self = $(parent).find('.panel[data-panel-id=' + _data.id + ']');
	};

	this.close = function() {
		_self.remove();
	}

	this.getId = function(){ return _data.id; }

	this.drawChart = function(chart) {
		_chart = chart;
		_chart.draw($(_self).find('.chart')[0]);
		var w = $(_self).width() - 20;
		var h = $(_self).height();
		_chart.resize(w, h);
	};

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