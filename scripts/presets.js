var presets = (function(){
    function PresetData(csvData, csvDataGroupedByYear) {
        var _csvData = csvData;
        var _csvDataGroupedByYear = csvDataGroupedByYear;
        
        this.getCsvData = function() { return _csvData; }
        this.getCsvDataGroupedByYear = function() { return _csvDataGroupedByYear; }
    }
    
    function Preset(title, options, dataCallback) {
        var _title = title;
        var _options = options;
        var _callback = dataCallback;
        
        this.getTitle = function() {
             return _title;
        };
        this.getOptions = function() { return _options; };
        this.getData = function(presetData) { return _callback(presetData); };
    }
    
    var presetsList = getPresets();
    
    return {
        Preset: Preset,
        PresetData: PresetData,
        all: presetsList
    };
    
    function getPresets() {
        return [
            getAverageHomicidesByFirearms()
        ];
    }
    
    function getAverageHomicidesByFirearms() {
        var callback = function(presetData) {
            var data = [];
            var yearDictData = presetData.getCsvDataGroupedByYear();
            
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
                data.push(item);
            }
            
            return data;
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