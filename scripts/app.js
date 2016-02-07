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
	var yearDictData = Data.csvDataToDateDict(csvData);
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
	chart.draw(data, labels);
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