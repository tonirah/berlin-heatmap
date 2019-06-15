define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {
    // map.initialize();

    var resultsObject = helpers.buildResultsObject();

    var promisedResults = search.arrayQuery("Sojamilch", resultsObject);
    promisedResults.done(function () {
        console.log("MAIN: Promise resolved! resultsObject: ");
        console.log(resultsObject);
    })
});