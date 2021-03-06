define(["leaflet", "app/districts", "app/search"], function (L, districts, search) {

    var districtsLayer;

    function initialize() {

        var myMap = L.map("mapId", {zoomSnap: 0.5}).setView([52.504, 13.411], 10.5);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/light_nolabels/{z}/{x}/{y}{r}.png", {
            maxZoom: 13,
            minZoom: 9,
            attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, &copy; Tiles: <a href=\"https://carto.com/attributions\">CARTO</a>, Districts: <a href=\"https://data.technologiestiftung-berlin.de/dataset/bezirksgrenzen\">Technologiestiftung Berlin</a>",
            subdomains: "abcd"
        }).addTo(myMap);

        // Initialize districts on map from geoJSON object
        districtsLayer = L.geoJSON(districts.geoJSON, {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 0.5,
                    color: "#666",
                    fill:true,
                    fillColor:"#666",
                    fillOpacity:0.5,
                    dashArray: "3"
                };
            },
            onEachFeature: onEachFeature
        }).addTo(myMap);

        // Zoom map to fit berlin districts to whole screen, and limit there
        myMap.fitBounds(districtsLayer.getBounds());
        myMap.setMaxBounds(myMap.getBounds());

        // Initialize info panel for # of results
        var infoDisplay = L.control();


        // HELPING FUNCTIONS for mouse hovering over districts, adapted from: https://leafletjs.com/examples/choropleth/

        function highlightFeature(e) {
            var district = e.target;
            district.setStyle({
                weight: 5,
                dashArray: ""
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
                mouseout: resetHighlight
            });
            if (L.Browser.mobile) {
                layer.on({
                    mousedown: highlightFeature,
                    mouseup: resetHighlight
                });
            }
        }

        infoDisplay.onAdd = function () {
            this._div = L.DomUtil.create("div", "infoDisplay");
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

        infoDisplay.addTo(myMap);
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
        return  d > 0.875 ? "#800026" :
                d > 0.75 ? "#BD0026" :
                d > 0.625 ? "#E31A1C" :
                d > 0.5 ? "#FC4E2A" :
                d > 0.375 ? "#FD8D3C" :
                d > 0.25 ? "#FEB24C" :
                d > 0.125 ? "#FED976" :
                "#FFEDA0";
    }

    function colorDistricts() {
        var relativeRelevanceObject = calculateRelativeRelevance(search.resultsObject);
        console.log("relativeRelevanceObject: ");
        console.log(relativeRelevanceObject);
        districtsLayer.eachLayer(function (layer) {
            var district = layer.feature.properties.Gemeinde_name;
            layer.setStyle({fillColor: getRelevanceColor(relativeRelevanceObject[district])});
        });
    }

    function resetDistrictColors() {
        districtsLayer.eachLayer(function (district) {
            districtsLayer.resetStyle(district);
        });
    }

    return {
        initialize: initialize,
        colorDistricts: colorDistricts,
        resetDistrictColors: resetDistrictColors
    }
});