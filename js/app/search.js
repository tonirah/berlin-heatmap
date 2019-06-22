define(["jquery", "app/helpers", "app/districts"], function ($, helpers, districts) {

    var resultsObject = helpers.buildObjectFromArray(districts.arrayOfDistricts);
    var responsesObject = helpers.buildObjectFromArray(districts.arrayForRequests);

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
        // Modified from: https://dev.cognitive.microsoft.com/docs/services/f40197291cd14401b93a478716e818bf/operations/56b4447dcf5ff8098cef380d
        var key = encryptKey();
        var jointQuery = query + " " + district;

        // Request parameters
        var params = {
            "q": jointQuery,
            "mkt": "de_DE"
        };

        // Return jQuery promise, to continue once data arrived
        return $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v7.0/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", key);
            },
            type: "GET",
            // Request body of response
            data: "{body}"
        });
    }

    function searchWithAllDistricts(query, responsesObject) {
        // Make jQ deferred object (promise), that is resolved when # of responses is equal to number of districts searched for
        var promisedResults = $.Deferred();
        var responseCounter = 0;

        // Free Bing API allows only 3 requests per ~1 second
        var splittedArray = helpers.chunkArray(districts.arrayForRequests, 3);
        var time = 1500;

        // Weird workaround, since JS doesn't have a sleep function. https://stackoverflow.com/a/30865841.
        for (var i = 0; i < splittedArray.length; i++) {
            (function (i) {
                setTimeout(function () {

                    // Search query for each district
                    splittedArray[i].forEach(function (district) {
                        simpleQuery(query, district).done(function (data) {

                            // Async section, executed when a result returns
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

        // Return promise immediately, gets resolved after last response
        return promisedResults.promise();
    }

    function DEVsearchWithAllDistricts(query, responsesObject) {
        // Make jQ deferred object (promise), that is resolved when # of responses is equal to number of districts searched for
        var promisedResults = $.Deferred();
        var responseCounter = 0;

        // Bing API allows only 3 requests per ~1 second
        var splittedArray = helpers.chunkArray(districts.arrayForRequests, 3);
        var time = 1000;

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

    function handleAPIResponse(data, district, resultsObject) {

        console.log(data);

        var numberOfResults;
        if(data.hasOwnProperty("webPages")) {
            numberOfResults = data.webPages.totalEstimatedMatches;
        } else {
            numberOfResults = 0
        }
        resultsObject[district] = numberOfResults;
    }

    return {
        resultsObject: resultsObject,
        responsesObject: responsesObject,
        searchWithAllDistricts: searchWithAllDistricts,
        DEVsearchWithAllDistricts: DEVsearchWithAllDistricts
    }
});