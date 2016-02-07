$(document).ready(function(){
	initEvents();
	$.event.trigger('loading.app', true);

	data.load('https://raw.githubusercontent.com/deeptowncitizen/homicide-visualize/master/Homicides_by_firearms.csv')
							.then(function(data){
								console.log(data);
								$.event.trigger('loading.app', false);
							}, function(error){
								console.log(error);
								$.event.trigger('error.app', {
									title: 'Can not retrieve statistics data file',
									text: '[' + error.status + '] ' + error.responseText + ': ' + error.responseURL,
									terminate: true});
							});
});

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