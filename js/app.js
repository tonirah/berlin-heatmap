require.config({
    baseUrl: "js/lib",
    paths: {
        "app": "../app",
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min",
        "bootstrap": "//stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min",
        "leaflet": "//unpkg.com/leaflet@1.5.1/dist/leaflet"
    },
    shim: {
        "bootstrap": ["jquery"]
    }
});

// Load the main app module to initialize the app
require(["app/main"]);