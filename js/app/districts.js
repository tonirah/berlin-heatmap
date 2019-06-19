define(["berlinDistrictsGeoJSON"], function (berlinDistrictsGeoJSON) {
    var geoJSON = berlinDistrictsGeoJSON.districts;

    var arrayForRequests = ["Charlottenburg", "Wilmersdorf", "Friedrichshain", "Kreuzberg", "Lichtenberg", "Marzahn", "Hellersdorf", "Berlin-Mitte", "Neukölln", "Pankow", "Reinickendorf", "Spandau", "Steglitz", "Zehlendorf", "Tempelhof", "Schöneberg", "Treptow", "Köpenick"];

    var arrayOfDistricts = ["Charlottenburg-Wilmersdorf", "Friedrichshain-Kreuzberg", "Lichtenberg", "Marzahn-Hellersdorf", "Berlin-Mitte", "Neukölln", "Pankow", "Reinickendorf", "Spandau", "Steglitz-Zehlendorf", "Tempelhof-Schöneberg", "Treptow-Köpenick"];

    return {
        geoJSON: geoJSON,
        arrayForRequests: arrayForRequests,
        arrayOfDistricts: arrayOfDistricts
    };
});