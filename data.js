var data = (function(){
	function loadFromCsv(csvUrl) {
		return new Promise(function(resolve, reject){
			d3.text(csvUrl, 'text-csv', function(status, data) {
				if (status == null)
					resolve(data);
				reject(status);
			})
		});
	}

	return {
		load: function(csvUrl) {
			return loadFromCsv(csvUrl);
		}
	}
})();