var Data = (function(){
	function loadFromCsv(csvUrl) {
		return new Promise(function(resolve, reject){
			$.get(csvUrl)
				.done(function(csvData){
					try {
						var data = parseCsv(csvData);
						resolve(data);
					}
					catch(e) {
						reject({title: "Error parsing CSV data", text: e});
					}
				})
				.fail(function(e){
					reject({title: "Can't retrieve statistics data file", text: e.status + ': ' + e.responseText});
				});
		});
	}

	function parseCsv(csvData) {
		var result = [];
		var lines = csvData.split('\n');
		for(var i = 0; i < lines.length; i++) {
			var line = new DataItem(lines[i]);
			if (!line.isValid)
				console.log(i);
			else
				result.push(line);
		}

		return result;
	}

	function CsvDataToDateTimeDict(csvData) {
		var result = {};
		for(var i = 0; i < csvData.length; i++) {
			var item = csvData[i];
			if (!result.hasOwnProperty(item.year))
				result[item.year] = [];

			result[item.year].push(item);
		}

		result.sort;
		return result;
	}

	function DataItem(row) {
		this.isValid = false;
		if (!row)
			return;

		var items = row.split(',');
		if (items.length != 8)
			return;

		this.country = items[0];
		this.region = items[6];
		this.subregion = items[7];
		this.year = parseInt(items[1]);
		this.population = parseInt(items[5]);
		this.percentageHomicidesByFirearms = parseFloat(items[2]);
		this.numberOfHomicidesByFirearms = parseFloat(items[3]);
		this.numberHomicidesByFirearmsPer100K = parseFloat(items[4]);
		this.isValid = true;
	}

	return {
		load: function(csvUrl) {
			return loadFromCsv(csvUrl);
		},
		parseCsv: function(data) {
			return parseCsv(data)
		},
		csvDataToDateDict: function(csvData) {
			return CsvDataToDateTimeDict(csvData);
		}
	}
})();