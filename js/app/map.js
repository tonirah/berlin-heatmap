define(["leaflet", "app/districts"], function (L, districts) {

    function initialize() {
        var mymap = L.map('mapId', {zoomSnap: 0.5}).setView([52.504, 13.411], 10.5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd'
        }).addTo(mymap);

        var districtsLayer = L.geoJSON(districts.geoJSON, {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 0.5,
                    color: '#000000',
                    fill:true,
                    fillColor:'#0000ff',
                    fillOpacity:0.3,
                    dashArray: "3"
                };
            }
        }).addTo(mymap);
        return districtsLayer;
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

    function getDistrictColor(d) {
        // https://leafletjs.com/examples/choropleth/
        return  d > 0.875 ? '#800026' :
                d > 0.75 ? '#BD0026' :
                d > 0.625 ? '#E31A1C' :
                d > 0.5 ? '#FC4E2A' :
                d > 0.375 ? '#FD8D3C' :
                d > 0.25 ? '#FEB24C' :
                d > 0.125 ? '#FED976' :
                '#FFEDA0';
    }

    function colorDistricts(resultsObject, districtsLayer) {
        var relativeRelevanceObject = calculateRelativeRelevance(resultsObject);

        districtsLayer.eachLayer(function (layer) {
            var district = layer.feature.properties.Gemeinde_name;

            layer.setStyle({fillColor: "#ff0000"});
            console.log(layer);

            // layer.setStyle(function (feature) {
            //     return {
            //         fillColor: "#ff0000"
            //     }
            // });
        });
    }

    return {
        initialize: initialize,
        colorDistricts: colorDistricts
    }
});