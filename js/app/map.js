define(["leaflet", "app/districts"], function (L, districts) {

    function initialize() {
        var mymap = L.map('mapId', {zoomSnap: 0.5}).setView([52.504, 13.411], 10.5);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
            maxZoom: 18,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd'
        }).addTo(mymap);

        L.geoJSON(districts.geoJSON, {
            style: function (feature) {
                return {
                    stroke: true,
                    weight: 0.5,
                    color: '#000000',
                    fill:true,
                    fillColor:'#000000',
                    fillOpacity:0.3
                };
            }
        }).bindPopup(function (layer) {
            return JSON.stringify(layer.feature.properties.Gemeinde_name);
        }).addTo(mymap);
    }

    return {
        initialize: initialize
    }
});