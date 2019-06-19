define(["berlinDistrictsGeoJSON"], function (berlinDistrictsGeoJSON) {
    var geoJSON = berlinDistrictsGeoJSON.districts;

    var arrayOfDistricts = ["Charlottenburg", "Wilmersdorf", "Friedrichshain", "Kreuzberg", "Lichtenberg", "Marzahn", "Hellersdorf", "Berlin-Mitte", "Neukoelln", "Pankow", "Reinickendorf", "Spandau", "Steglitz", "Zehlendorf", "Tempelhof", "Schoeneberg", "Treptow", "Koepenick"];

    return {
        geoJSON: geoJSON,
        arrayOfDistricts: arrayOfDistricts
    };
});