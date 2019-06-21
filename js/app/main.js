define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {

    var searchButton = document.querySelector("#submit");
    // var status = document.querySelector("#status");
    // var results = document.querySelector("#results");
    // var relativeRelevance = document.querySelector("#relativeRelevance");

    var responsesObject = search.responsesObject;
    var resultsObject = search.resultsObject;

    searchButton.addEventListener("click", newRequest, false);
    helpers.fixEnterBehaviour(newRequest);

    map.initialize();

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

            map.colorDistricts();
            // results.innerHTML = JSON.stringify(resultsObject, undefined, 2);
            // relativeRelevance.innerHTML = JSON.stringify(relativeRelevanceObject, undefined, 2);
            //
            // status.innerHTML = "";
        });
    }
});