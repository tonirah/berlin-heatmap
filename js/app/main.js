define(["app/map", "app/search", "app/helpers"], function (map, search, helpers) {
    map.initialize();

    var searchButton = document.querySelector("#submit");
    var status = document.querySelector("#status");
    var results = document.querySelector("#results");

    searchButton.addEventListener("click", newRequest, false);
    helpers.fixEnterBehaviour(newRequest);

    var resultsObject = helpers.buildResultsObject();


    function newRequest() {
        var query = document.querySelector("#query").value;
        if (query === "") {
            // TODO
            // Alert, "please enter a search term"
            return false;
        }

        status.innerHTML = "Loading, please wait....";
        results.innerHTML = "";

        var promisedResults = search.arrayQuery(query, resultsObject);
        promisedResults.done(function () {
            results.innerHTML = JSON.stringify(resultsObject, undefined, 2);
            status.innerHTML = "";
        });
    }
});