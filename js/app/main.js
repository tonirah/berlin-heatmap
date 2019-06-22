define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {

    var searchButton = document.querySelector("#submit");
    searchButton.addEventListener("click", newRequest, false);
    helpers.sendRequestsWithEnter(newRequest);

    var responsesObject = search.responsesObject;
    var resultsObject = search.resultsObject;

    map.initialize();

    function newRequest() {
        var query = document.querySelector("#query").value;

        // Process empty request
        if (query === "") {
            // TODO
            // Alert, "please enter a search term"
            return false;
        }

        // LOADING
        console.log("query: " + query);
        // Hide onscreen keyboards on mobile
        searchButton.blur();
        map.resetDistrictColors();
        helpers.showLoading();

        // Async function getting promise for results
        var promisedResponses = search.searchWithAllDistricts(query, responsesObject);

        // RESULTS ARRIVED, PROCESS THEM
        promisedResponses.done(function () {
            helpers.fillResultsObject(responsesObject, resultsObject);

            map.colorDistricts();
            helpers.hideLoading();

            console.log("resultsObject:");
            console.log(resultsObject);
        });
    }
});