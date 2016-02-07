var series = (function(){
	function loadFromCsv(csvUrl) {
		return new Promise(function(resolve, reject){
			$.get(csvUrl)
				.done(function(csvData){
					try {
						var data = Data.parseCsv(csvData);
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
    
    function Data(csvData) {
        var _csvData = csvData;
        var _csvDataByYear = {};
        var _csvDataByRegion = {};
        var _csvDataBySubregion = {};
        
        this.getCsvData = function() { return _csvData; };
        
        this.getCsvDataByYear = function() {
            if (_csvDataByYear.length > 0)
                return _csvDataByYear;
                
            for(var i = 0; i < _csvData.length; i++) {
                var item = _csvData[i];
                if (!_csvDataByYear.hasOwnProperty(item.year))
                    _csvDataByYear[item.year] = [];

                _csvDataByYear[item.year].push(item);
            }

            _csvDataByYear.sort;
            return _csvDataByYear;
        };
        
        this.getCsvDataByRegion = function() {
            if (_csvDataByRegion.length > 0)
                return _csvDataByRegion;
                
            for(var i = 0; i < _csvData.length; i++) {
                var item = _csvData[i];
                if (!_csvDataByRegion.hasOwnProperty(item.region))
                    _csvDataByRegion[item.region] = [];

                _csvDataByRegion[item.region].push(item);
            }

            _csvDataByRegion.sort;
            return _csvDataByRegion;
        };
        
        this.getCsvDataBySubregion = function() {
            if (_csvDataBySubregion.length > 0)
                return _csvDataBySubregion;
                
            for(var i = 0; i < _csvData.length; i++) {
                var item = _csvData[i];
                if (!_csvDataBySubregion.hasOwnProperty(item.subregion))
                    _csvDataBySubregion[item.subregion] = [];

                _csvDataBySubregion[item.subregion].push(item);
            }

            _csvDataBySubregion.sort;
            return _csvDataBySubregion;
        };
        
        this.dictByYear = function(dict) {
            var results = {};
            for(var d in dict) {
                if (!results.hasOwnProperty(dict[d].year))
                    results[dict[d].year] = [];

                results[dict[d].year].push(dict[d]);
            }
            
            return results;
        };
    }
    
    Data.parseCsv = function(csvData) {
		var result = [];
		var lines = csvData.split('\n');
		for(var i = 1; i < lines.length-1; i++) {
			var line = new DataItem(lines[i]);
			if (line.isValid)
				result.push(line);
		}

		return new Data(result);
	};

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