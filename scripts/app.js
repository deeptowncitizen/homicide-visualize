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

    app.loadPresetByTitle('Percentage homicides by firearms by country (United States of America), %');
    app.loadPresetByTitle('Percentage homicides by firearms by country (Ukraine), %');
    app.loadPresetByTitle('Per 100k homicides by firearms by country (United States of America), Avg. qnty');
    app.loadPresetByTitle('Per 100k homicides by firearms by country (Ukraine), Avg. qnty');
    app.loadPresetByTitle('Number of homicides with firearms (United States of America), Avg. qnty');
    app.loadPresetByTitle('Number of homicides with firearms (Ukraine), Avg. qnty');

    app.loadPresetByTitle('Per 100k homicides by firearms in the world, Avg. qnty');
    app.loadPresetByTitle('Number of homicides by firearms in the world, Avg. qnty');

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
	
	this.addPanel = function(title, data){
		var panel = new Panel(this.getNextChartId(), title, getNextColumn());
		_panels.push(panel);

		panel.RenderData(data);
	};
    
    this.loadPresetByTitle = function(title) {
        var index = -1;
        var preset = $.grep(_presets, function(e, i){ if (e.getTitle() == title) { index = i; return true; } return false; });
        if (preset.length != 1) {
            $.event.trigger("error.app", {title: 'Error loading preset', text: "Can't load preset with title: " + title});
            return;
        }
        
        this.loadPreset(index);
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
        $('#presets-list').select2({ width : "auto" });
        
        $('.button-about').click(function(e){
            $.event.trigger("modal.app", {title: 'About', text: 'about.html'});
            e.preventDefault();
        });
    }
    
    ctor();
}

function Panel(id, title, parent) {
	var _data = {
		id: id,
		title: title
	};
	var _parent = parent;
	var _panelData = null;
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

	this.RenderData = function(panelData) {
		_panelData = panelData;
		_panelData.draw($(_self).find('.panel-data')[0]);
		var w = $(_self).width() - 20;
		var h = $(_self).height();
		_panelData.resize(w, h);
	};

	ctor();
}




function initEvents() {
    /*
    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
    var originalSuccess = options.success;

    options.success = function (data) {
        if(!data) {
           //forward to error event handler or redirect to login page for example
        }
        else {
            if (originalSuccess != null) {
                originalSuccess(data);
            }
        }   
    };
});*/

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
    
    $(document).on('modal.app', function(e, info){
        if (!info.text.match(/\.html/)) {
            $('#modal-window').on('show.bs.modal', function (event) {
                var modal = $(this);
                modal.find('.modal-title').text(info.title);
                modal.find('.modal-body').html(info.text);
            });
            $('#modal-window').modal();
            
            return;
        }
        
        $.get('https://raw.githubusercontent.com/deeptowncitizen/homicide-visualize/master/' + info.text)
				.done(function(aboutHtml){
                    $('#modal-window').on('show.bs.modal', function (event) {
                        var modal = $(this);
                        modal.find('.modal-title').text(info.title);
                        modal.find('.modal-body').html(aboutHtml);
                    });
                    $('#modal-window').modal();
				})
				.fail(function(e){
					$.event.trigger('error.app', {title: 'Error loading about page', text: e});
				});
	});
}