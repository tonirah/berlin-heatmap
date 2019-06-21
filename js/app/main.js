define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {
    var districtsLayer = map.initialize();

    var searchButton = document.querySelector("#submit");
    // var status = document.querySelector("#status");
    // var results = document.querySelector("#results");
    // var relativeRelevance = document.querySelector("#relativeRelevance");

    var responsesObject = helpers.buildResponsesObject();
    var resultsObject = helpers.buildResultsObject();

    searchButton.addEventListener("click", newRequest, false);
    helpers.fixEnterBehaviour(newRequest);

    function newRequest() {
        var query = document.querySelector("#query").value;
        if (query === "") {
            // TODO
            // Alert, "please enter a search term"
            return false;
        }

        // status.innerHTML = "Loading, please wait....";
        // results.innerHTML = "";
        // relativeRelevance.innerHTML = "";

        var promisedResponses = search.DEVarrayQuery(query, responsesObject);
        promisedResponses.done(function () {
            helpers.fillResultsObject(responsesObject, resultsObject);

            console.log(resultsObject);
            map.colorDistricts(resultsObject, districtsLayer);
            // results.innerHTML = JSON.stringify(resultsObject, undefined, 2);
            // relativeRelevance.innerHTML = JSON.stringify(relativeRelevanceObject, undefined, 2);
            //
            // status.innerHTML = "";
        });
    }
});