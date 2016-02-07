var presets = (function(){    
    function Preset(title, options, dataCallback) {
        var _title = title;
        var _options = options;
        var _callback = dataCallback;
        
        this.getTitle = function() {
             return _title;
        };
        this.getOptions = function() { return _options; };
        this.getData = function(data) { return _callback(data); };
    }
    
    return {
        Preset: Preset,
        load: function(data) {
            return getPresets(data);
        }
    };
    
    function getPresets(data) {
        var result = [
            getAverageHomicidesByFirearms()
        ];
        
        result.push.apply(result, getPrecentHomicidesByRegion(data));
        return result;
    }
    
    function getPrecentHomicidesByRegion(data) {
        var results = [];
        
        for(var regionName in data.getCsvDataByRegion()) {
            var callback = function(data, country) {
                var result = [];
                var regionsData = data.getCsvDataByRegion();
                var regionData = regionsData[country];
                if (!regionData)
                    return result;
                    
                var regionDataByYear = data.dictByYear(regionData);
                
                for(var regionYear in regionDataByYear) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    for(var i = 0; i < regionDataByYear[regionYear].length; i++) {
                        if (isNaN(regionDataByYear[regionYear][i].percentageHomicidesByFirearms))
                            nanCount++;
                        else
                            percentSum += regionDataByYear[regionYear][i].percentageHomicidesByFirearms;
                    }
                    var avg = percentSum / regionDataByYear[regionYear].length;
                    var nanAvg = nanCount / regionDataByYear[regionYear].length * 100;
                    item.push(regionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(
                'Average homicides percentage by firearms (' + regionName + ')',
                {
                    labels: ['Year', '%', 'NaN'],
                    ylabel: 'Year',
                    xlabel: 'Homicides by firearms, %'
                },
                function(region){
                    var rgn = region;
                    return function(data) {
                        return callback(data, rgn);
                    }
                }(regionName)
            );
            
            results.push(result);
        }
        
        return results;
    }
    
    function getAverageHomicidesByFirearms() {
        var callback = function(data) {
            var result = [];
            var yearDictData = data.getCsvDataByYear();
            
            for(var year in yearDictData) {
                var item = [];
                var percentSum = 0;
                for(var i = 0; i < yearDictData[year].length; i++) {
                    if (!yearDictData[year][i].percentageHomicidesByFirearms)
                        continue;
                    percentSum += yearDictData[year][i].percentageHomicidesByFirearms;
                }
                var avg = percentSum / yearDictData[year].length;
                item.push(year);
                item.push(avg);
                result.push(item);
            }
            
            return result;
        };
    
        var result = new Preset(
            'Average homicides percentage by firearms',
            {
                labels: ['Year', 'Avg %'],
                ylabel: 'Year',
                xlabel: 'Homicides by arms, %'
            },
            callback
        );
        
        return result;
    }
})();