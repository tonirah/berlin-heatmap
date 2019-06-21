define(["leaflet", "app/districts", "app/search"], function (L, districts, search) {

    var districtsLayer;

    function initialize() {

        var mymap = L.map('mapId', {zoomSnap: 0.5}).setView([52.504, 13.411], 10.5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd'
        }).addTo(mymap);

        districtsLayer = L.geoJSON(districts.geoJSON, {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 0.5,
                    color: '#666',
                    fill:true,
                    fillColor:'#666',
                    fillOpacity:0.5,
                    dashArray: "3"
                };
            },
            onEachFeature: onEachFeature
        }).addTo(mymap);

        var infoDisplay = L.control();

        // Helping functions for map
        function highlightFeature(e) {
            var district = e.target;
            district.setStyle({
                weight: 5,
                dashArray: ''
            });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                district.bringToFront();
            }
            infoDisplay.update(district.feature.properties.Gemeinde_name);
        }

        function resetHighlight(e) {
            e.target.setStyle({
                weight: 0.5,
                dashArray: "3"
            });
            infoDisplay.update();
        }

        function onEachFeature(feature, layer) {
            // https://leafletjs.com/examples/choropleth/, adjusted
            layer.on({
                mouseover: highlightFeature,
                mousedown: highlightFeature,
                mouseout: resetHighlight,
            });
        }

        infoDisplay.onAdd = function (mymap) {
            this._div = L.DomUtil.create('div', 'infoDisplay');
            this.update();
            return this._div;
        };

        infoDisplay.update = function (district) {
            var message = "<h4># of search results</h4>";

            if (!district) {
                // Nothing
            } else {
                message += "<strong>" + district + "</strong>";
                if (search.resultsObject[district]){
                    message += "<br>" + search.resultsObject[district] + " estimated results";
                }
            }

            this._div.innerHTML = message;
        };

        // End of: helping functions
        infoDisplay.addTo(mymap);
    }

    function calculateRelativeRelevance(resultsObject) {
        var relativeRelevanceObject = {};
        // Get min, max and span min-max value from # of results
        // https://stackoverflow.com/a/11142934
        var min = Infinity, max = -Infinity;
        for(var d in resultsObject) {
            if( resultsObject[d] < min) min = resultsObject[d];
            if( resultsObject[d] > max) max = resultsObject[d];
        }
        var span = max - min;

        // Iterate over resultsObject, normalize
        for (var district in resultsObject) {
            var number = (resultsObject[district] - min) / span;
            relativeRelevanceObject[district] = parseFloat(number.toFixed(2));
        }

        return relativeRelevanceObject;
    }

    function getRelevanceColor(d) {
        // https://leafletjs.com/examples/choropleth/, adjusted
        return  d > 0.875 ? '#800026' :
                d > 0.75 ? '#BD0026' :
                d > 0.625 ? '#E31A1C' :
                d > 0.5 ? '#FC4E2A' :
                d > 0.375 ? '#FD8D3C' :
                d > 0.25 ? '#FEB24C' :
                d > 0.125 ? '#FED976' :
                '#FFEDA0';
    }

    function colorDistricts() {
        var relativeRelevanceObject = calculateRelativeRelevance(search.resultsObject);
        districtsLayer.eachLayer(function (layer) {
            var district = layer.feature.properties.Gemeinde_name;
            layer.setStyle({fillColor: getRelevanceColor(relativeRelevanceObject[district])});
        });
    }

    return {
        initialize: initialize,
        colorDistricts: colorDistricts
    }
});