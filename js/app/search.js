define(["jquery", "app/helpers", "app/districts"], function ($, helpers, districts) {

    var resultsObject = helpers.buildResultsObject();
    var responsesObject = helpers.buildResponsesObject();

    function encryptKey() {
        // bing api key encrypted with https://www.stringencrypt.com, to prevent lazy developers from stealing it :)
        var key = "\u6500\u31FF\u33FE\u62FD\u61FC\u33FB";
        for (var PpIJQ = 0, cYnxs = 0; PpIJQ < 6; PpIJQ++)
        {
            cYnxs = key.charCodeAt(PpIJQ);
            cYnxs += PpIJQ;
            cYnxs = (((cYnxs & 0xFFFF) >> 8) | (cYnxs << 8)) & 0xFFFF;
            key = key.substr(0, PpIJQ) + String.fromCharCode(cYnxs & 0xFFFF) + key.substr(PpIJQ + 1);
        }
        key += "b5780e4047aca8784b4d51ea6f";
        return key;
    }

    function simpleQuery(query, district) {
        var key = encryptKey();
        var jointQuery = query + " " + district;
        // Modified from: https://dev.cognitive.microsoft.com/docs/services/f40197291cd14401b93a478716e818bf/operations/56b4447dcf5ff8098cef380d
        var params = {
            // Request parameters
            "q": jointQuery,
            "mkt": "de_DE"
        };
        return $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v7.0/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", key);
            },
            type: "GET",
            // Request body
            data: "{body}"
        });
    }

    function arrayQuery(query, responsesObject) {
        // Make jQ deferred object (promise), that is resolved when # of responses is equal to number of districts searched for
        var promisedResults = $.Deferred();
        var responseCounter = 0;

        // Bing API allows only 3 requests per ~1 second
        var splittedArray = helpers.chunkArray(districts.arrayForRequests, 3);
        var time = 1500;

        // Weird workaround, since JS doesn't have a sleep function. Source: Somewhere on Stackoverflow.
        for (var i = 0; i < splittedArray.length; i++) {
            (function (i) {
                setTimeout(function () {

                    // Search query for each district
                    splittedArray[i].forEach(function (district) {
                        simpleQuery(query, district).done(function (data) {
                            handleAPIResponse(data, district, responsesObject);
                            responseCounter++;
                            console.log(responseCounter);

                            // Resolve promise after last response
                            if (responseCounter === districts.arrayForRequests.length) {
                                console.log("ALL REQUESTS DONE!");
                                promisedResults.resolve();
                            }
                        })
                    })
                }, time * i);
            })(i);
        }

        return promisedResults.promise();

    }

    function handleAPIResponse(data, district, resultsObject) {
        var numberOfResults;

        if(data.hasOwnProperty('webPages')) {
            numberOfResults = data.webPages.totalEstimatedMatches;
        } else {
            numberOfResults = 0
        }
        resultsObject[district] = numberOfResults;

        console.log(data);
    }

    function DEVarrayQuery(query, responsesObject) {
        // Make jQ deferred object (promise), that is resolved when # of responses is equal to number of districts searched for
        var promisedResults = $.Deferred();
        var responseCounter = 0;

        // Bing API allows only 3 requests per ~1 second
        var splittedArray = helpers.chunkArray(districts.arrayForRequests, 3);
        var time = 100;

        // Weird workaround, since JS doesn't have a sleep function. Source: Somewhere on Stackoverflow.
        for (var i = 0; i < splittedArray.length; i++) {
            (function (i) {
                setTimeout(function () {

                    // Search query for each district
                    splittedArray[i].forEach(function (district) {
                        // RANDOM NUMBER OF RESULTS
                        responsesObject[district] = Math.floor(Math.random() * Math.floor(1000));
                        responseCounter++;
                        console.log(responseCounter);

                        // Resolve promise after last response
                        if (responseCounter === districts.arrayForRequests.length) {
                            console.log("ALL REQUESTS DONE!");
                            promisedResults.resolve();
                        }
                    })
                }, time * i);
            })(i);
        }

        return promisedResults.promise();
    }

    return {
        resultsObject: resultsObject,
        responsesObject: responsesObject,
        arrayQuery: arrayQuery,
        DEVarrayQuery: DEVarrayQuery
    }
});