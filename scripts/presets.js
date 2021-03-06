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
            getAverageHomicidesByFirearms(),
            getAverageHomicidesPer100KByFirearms(),
            getAvgNumberOfHomicides()
        ];
        
        result.push.apply(result, getPrecentHomicidesByRegion(data));
        result.push.apply(result, getHomicidesPer100KByRegion(data));
        result.push.apply(result, getNumberOfHomicidesRegion(data));
        
        result.push.apply(result, getPrecentHomicidesBySubregion(data));
        result.push.apply(result, getHomicidesPer100KBySubregion(data));
        result.push.apply(result, getNumberOfHomicidesBySubregion(data));
        
        result.push.apply(result, getPrecentHomicidesByCountry(data));
        result.push.apply(result, getHomicidesPer100KByCountry(data));
        result.push.apply(result, getNumberOfHomicidesByCountry(data));

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
                'Percentage homicides by firearms by region (' + regionName + '), Avg. %',
                {
                    labels: ['Year', '%', 'NaN'],
                    ylabel: 'Avg homicides by region, %',
                    xlabel: 'Year'
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
    
    function getHomicidesPer100KByRegion(data) {
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
                        if (isNaN(regionDataByYear[regionYear][i].numberHomicidesByFirearmsPer100K))
                            nanCount++;
                        else
                            percentSum += regionDataByYear[regionYear][i].numberHomicidesByFirearmsPer100K;
                    }
                    var avg = percentSum / regionDataByYear[regionYear].length;
                    var nanAvg = nanCount / regionDataByYear[regionYear].length;
                    item.push(regionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(
                'Per 100k homicides by firearms by region (' + regionName + '), Avg. qnty',
                {
                    labels: ['Year', 'Per 100k', 'NaN'],
                    ylabel: 'Avg homicides per 100k by region, qnty',
                    xlabel: 'Year'
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
    
    function getNumberOfHomicidesRegion(data) {
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
                        if (isNaN(regionDataByYear[regionYear][i].numberOfHomicidesByFirearms))
                            nanCount++;
                        else
                            percentSum += regionDataByYear[regionYear][i].numberOfHomicidesByFirearms;
                    }
                    var avg = percentSum / regionDataByYear[regionYear].length;
                    var nanAvg = nanCount / regionDataByYear[regionYear].length;
                    item.push(regionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(
                'Number of homicides by region (' + regionName + '), Avg. qnty',
                {
                    labels: ['Year', 'Qnty', 'NaN'],
                    ylabel: 'Number of homicides by region, Avg. qnty',
                    xlabel: 'Year'
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
    
    function getPrecentHomicidesBySubregion(data) {
        var results = [];
        
        for(var subregionName in data.getCsvDataBySubregion()) {
            var callback = function(data, country) {
                var result = [];
                var subregionsData = data.getCsvDataBySubregion();
                var subregionData = subregionsData[country];
                if (!subregionData)
                    return result;
                    
                var subregionDataByYear = data.dictByYear(subregionData);
                
                for(var subregionYear in subregionDataByYear) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    for(var i = 0; i < subregionDataByYear[subregionYear].length; i++) {
                        if (isNaN(subregionDataByYear[subregionYear][i].percentageHomicidesByFirearms))
                            nanCount++;
                        else
                            percentSum += subregionDataByYear[subregionYear][i].percentageHomicidesByFirearms;
                    }
                    var avg = percentSum / subregionDataByYear[subregionYear].length;
                    var nanAvg = nanCount / subregionDataByYear[subregionYear].length * 100;
                    item.push(subregionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(
                'Percentage homicides by firearms by subregion (' + subregionName + '), Avg. %',
                {
                    labels: ['Year', '%', 'NaN'],
                    ylabel: 'Avg homicides by subregion, %',
                    xlabel: 'Year'
                },
                function(region){
                    var rgn = region;
                    return function(data) {
                        return callback(data, rgn);
                    }
                }(subregionName)
            );
            
            results.push(result);
        }
        
        return results;
    }
    
    function getHomicidesPer100KBySubregion(data) {
        var results = [];
        
        for(var subregionName in data.getCsvDataBySubregion()) {
            var callback = function(data, country) {
                var result = [];
                var subregionsData = data.getCsvDataBySubregion();
                var subregionData = subregionsData[country];
                if (!subregionData)
                    return result;
                    
                var subregionDataByYear = data.dictByYear(subregionData);
                
                for(var subregionYear in subregionDataByYear) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    for(var i = 0; i < subregionDataByYear[subregionYear].length; i++) {
                        if (isNaN(subregionDataByYear[subregionYear][i].numberHomicidesByFirearmsPer100K))
                            nanCount++;
                        else
                            percentSum += subregionDataByYear[subregionYear][i].numberHomicidesByFirearmsPer100K;
                    }
                    var avg = percentSum / subregionDataByYear[subregionYear].length;
                    var nanAvg = nanCount / subregionDataByYear[subregionYear].length;
                    item.push(subregionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(                
                'Per 100k homicides by firearms by subregion (' + subregionName + '), Avg. qnty',
                {
                    labels: ['Year', 'Per 100k', 'NaN'],
                    ylabel: 'Avg homicides per 100k by subregion, qnty',
                    xlabel: 'Year'
                },
                function(region){
                    var rgn = region;
                    return function(data) {
                        return callback(data, rgn);
                    }
                }(subregionName)
            );
            
            results.push(result);
        }
        
        return results;
    }
    
    function getNumberOfHomicidesBySubregion(data) {
        var results = [];
        
        for(var subregionName in data.getCsvDataBySubregion()) {
            var callback = function(data, country) {
                var result = [];
                var subregionsData = data.getCsvDataBySubregion();
                var subregionData = subregionsData[country];
                if (!subregionData)
                    return result;
                    
                var subregionDataByYear = data.dictByYear(subregionData);
                
                for(var subregionYear in subregionDataByYear) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    for(var i = 0; i < subregionDataByYear[subregionYear].length; i++) {
                        if (isNaN(subregionDataByYear[subregionYear][i].numberOfHomicidesByFirearms))
                            nanCount++;
                        else
                            percentSum += subregionDataByYear[subregionYear][i].numberOfHomicidesByFirearms;
                    }
                    var avg = percentSum / subregionDataByYear[subregionYear].length;
                    var nanAvg = nanCount / subregionDataByYear[subregionYear].length;
                    item.push(subregionYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                }
                
                return result;
            };
        
            var result = new Preset(                
                'Number of homicides by subregion (' + subregionName + '), Avg. qnty',
                {
                    labels: ['Year', 'Qnty', 'NaN'],
                    ylabel: 'Number of homicides by subregion, Avg. qnty',
                    xlabel: 'Year'
                },
                function(region){
                    var rgn = region;
                    return function(data) {
                        return callback(data, rgn);
                    }
                }(subregionName)
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
                var nanCount = 0;
                for(var i = 0; i < yearDictData[year].length; i++) {
                    if (isNaN(yearDictData[year][i].percentageHomicidesByFirearms))
                        nanCount++;
                    else
                        percentSum += yearDictData[year][i].percentageHomicidesByFirearms;
                }
                var avg = percentSum / yearDictData[year].length;
                var nanAvg = nanCount / yearDictData[year].length * 100;
                item.push(year);
                item.push(avg);
                item.push(nanAvg);
                result.push(item);
            }
            
            return result;
        };
    
        var result = new Preset(
            'Percentage homicides by firearms in the world, Avg. %',
            {
                labels: ['Year', 'Avg %', 'NaN'],
                ylabel: 'Avg homicides by firearms, %',
                xlabel: 'Year'
            },
            callback
        );
        
        return result;
    }
    
    function getAverageHomicidesPer100KByFirearms() {
        var callback = function(data) {
            var result = [];
            var yearDictData = data.getCsvDataByYear();
            
            for(var year in yearDictData) {
                var item = [];
                var percentSum = 0;
                var nanCount = 0;
                for(var i = 0; i < yearDictData[year].length; i++) {
                    if (isNaN(yearDictData[year][i].numberHomicidesByFirearmsPer100K))
                        nanCount++;
                    else
                        percentSum += yearDictData[year][i].numberHomicidesByFirearmsPer100K;
                }
                var avg = percentSum / yearDictData[year].length;
                var nanAvg = nanCount / yearDictData[year].length;
                item.push(year);
                item.push(avg);
                item.push(nanAvg);
                result.push(item);
            }
            
            return result;
        };
    
        var result = new Preset(
            'Per 100k homicides by firearms in the world, Avg. qnty',
            {
                labels: ['Year', 'Per 100k', 'NaN'],
                ylabel: 'Avg homicides per 100k by firearms, qnty',
                xlabel: 'Year'
            },
            callback
        );
        
        return result;
    }
    
    function getAvgNumberOfHomicides() {
        var callback = function(data) {
            var result = [];
            var yearDictData = data.getCsvDataByYear();
            
            for(var year in yearDictData) {
                var item = [];
                var percentSum = 0;
                var nanCount = 0;
                for(var i = 0; i < yearDictData[year].length; i++) {
                    if (isNaN(yearDictData[year][i].numberOfHomicidesByFirearms))
                        nanCount++;
                    else
                        percentSum += yearDictData[year][i].numberOfHomicidesByFirearms;
                }
                var avg = percentSum / yearDictData[year].length;
                var nanAvg = nanCount / yearDictData[year].length;
                item.push(year);
                item.push(avg);
                item.push(nanAvg);
                result.push(item);
            }
            
            return result;
        };
    
        var result = new Preset(
            'Number of homicides by firearms in the world, Avg. qnty',
            {
                labels: ['Year', 'Per 100k', 'NaN'],
                ylabel: 'Number of homicides by firearms, Avg. qnty',
                xlabel: 'Year'
            },
            callback
        );
        
        return result;
    }
    
    function getPrecentHomicidesByCountry(data) {
        var results = [];
        var countries = $(data.getCsvData()).map(function(i, e){ return e.country; });
        countries = $.unique(countries);
        
        $.each(countries, function(i, cntry) {
            var callback = function(data, country) {
                var result = [];
                var countryDict = $.grep(data.getCsvData(), function(e, i){
                     return e.country == country;
                });
                var countryDictByYear = data.dictByYear(countryDict);
                    
                
                $.each(countryDictByYear, function(countryYear, e) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    for(var i = 0; i < e.length; i++) {
                        if (isNaN(e[i].percentageHomicidesByFirearms))
                            nanCount++;
                        else
                            percentSum += e[i].percentageHomicidesByFirearms;
                    }
                    var avg = percentSum / e.length;
                    var nanAvg = nanCount / e.length * 100;
                    item.push(countryYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                });
                
                return result;
            };
        
            var result = new Preset(
                'Percentage homicides by firearms by country (' + cntry + '), %',
                {
                    labels: ['Year', '%', 'NaN'],
                    ylabel: 'Homicides by country, %',
                    xlabel: 'Year'
                },
                function(country){
                    var c = country;
                    return function(data) {
                        return callback(data, c);
                    }
                }(cntry)
            );

            results.push(result);
        });
        
        return results;
    }
    
    function getHomicidesPer100KByCountry(data) {
        var results = [];
        var countries = $(data.getCsvData()).map(function(i, e){ return e.country; });
        countries = $.unique(countries);
        
        $.each(countries, function(i, cntry) {
            var callback = function(data, country) {
                var result = [];
                var countryDict = $.grep(data.getCsvData(), function(e, i){
                     return e.country == country;
                });
                var countryDictByYear = data.dictByYear(countryDict);
                    
                
                $.each(countryDictByYear, function(countryYear, e) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    if (e.length != 1)
                        throw 'Incorrect country data: ' + country + ' for year: ' + countryYear;
                        
                    if (isNaN(e[0].numberHomicidesByFirearmsPer100K))
                        nanCount++;
                    else
                        percentSum += e[0].numberHomicidesByFirearmsPer100K;

                    var avg = percentSum / e.length;
                    var nanAvg = nanCount / e.length;
                    item.push(countryYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                });
                
                return result;
            };
        
            var result = new Preset(
                'Per 100k homicides by firearms by country (' + cntry + '), Avg. qnty',
                {
                    labels: ['Year', 'Per 100k', 'NaN'],
                    ylabel: 'Homicides per 100k by country, qnty',
                    xlabel: 'Year'
                },
                function(country){
                    var c = country;
                    return function(data) {
                        return callback(data, c);
                    }
                }(cntry)
            );

            results.push(result);
        });
        
        return results;
    }
    
    function getNumberOfHomicidesByCountry(data) {
        var results = [];
        var countries = $(data.getCsvData()).map(function(i, e){ return e.country; });
        countries = $.unique(countries);
        
        $.each(countries, function(i, cntry) {
            var callback = function(data, country) {
                var result = [];
                var countryDict = $.grep(data.getCsvData(), function(e, i){
                     return e.country == country;
                });
                var countryDictByYear = data.dictByYear(countryDict);
                    
                
                $.each(countryDictByYear, function(countryYear, e) {
                    var item = [];
                    var percentSum = 0;
                    var nanCount = 0;
                    if (e.length != 1)
                        throw 'Incorrect country data: ' + country + ' for year: ' + countryYear;
                        
                    if (isNaN(e[0].numberOfHomicidesByFirearms))
                        nanCount++;
                    else
                        percentSum += e[0].numberOfHomicidesByFirearms;

                    var avg = percentSum / e.length;
                    var nanAvg = nanCount / e.length;
                    item.push(countryYear);
                    item.push(avg);
                    item.push(nanAvg);
                    result.push(item);
                });
                
                return result;
            };
        
            var result = new Preset(
                'Number of homicides with firearms (' + cntry + '), Avg. qnty',
                {
                    labels: ['Year', 'Qnty', 'NaN'],
                    ylabel: 'Number of homicides by country, qnty',
                    xlabel: 'Year'
                },
                function(country){
                    var c = country;
                    return function(data) {
                        return callback(data, c);
                    }
                }(cntry)
            );

            results.push(result);
        });
        
        return results;
    }
})();