define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {

    var searchButton = document.querySelector("#submit");

    var responsesObject = search.responsesObject;
    var resultsObject = search.resultsObject;

    searchButton.addEventListener("click", newRequest, false);
    helpers.fixEnterBehaviour(newRequest);

    map.initialize();

    function newRequest() {
        searchButton.blur();

        var query = document.querySelector("#query").value;
        if (query === "") {
            // TODO
            // Alert, "please enter a search term"
            return false;
        }

        map.resetDistrictColors();
        helpers.showLoading();


        var promisedResponses = search.arrayQuery(query, responsesObject);
        promisedResponses.done(function () {
            helpers.fillResultsObject(responsesObject, resultsObject);

            map.colorDistricts();
            helpers.hideLoading();
        });
    }
});