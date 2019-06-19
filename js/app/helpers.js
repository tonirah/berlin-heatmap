define(["jquery", "app/districts"], function ($, districts) {

    // https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
    function chunkArray(myArray, chunk_size){
        var arrayLength = myArray.length;
        var tempArray = [];
        var myChunk;

        for (var index = 0; index < arrayLength; index += chunk_size) {
            myChunk = myArray.slice(index, index+chunk_size);
            // Do something if you want with the group
            tempArray.push(myChunk);
        }
        return tempArray;
    }

    function buildResponsesObject() {
        var arrayForRequests = districts.arrayForRequests;
        var responsesObject = {};
        for (var i = 0; i < arrayForRequests.length; i++) {
            responsesObject[arrayForRequests[i]] = null;
        }
        return responsesObject;
    }

    function buildResultsObject() {
        var arrayOfDistricts = districts.arrayOfDistricts;
        var resultsObject = {};
        for (var i = 0; i < arrayOfDistricts.length; i++) {
            resultsObject[arrayOfDistricts[i]] = null;
        }
        return resultsObject;
    }

    function fillResultsObject(responsesObject, resultsObject) {
        // Workaround for double-districts, because of Bing-Api request limit
        // In real project: Not necessary, because RPS is not limited
        // Workaround: Get two numbers, make average

        for (var district in resultsObject) {
            // Identify double district (-)
            if (district.indexOf("-") !== -1) {
                // Split string into two districts
                var twoDistricts = district.split("-");
                // Get two numbers, make average, write to resultsObject
                var number1 = responsesObject[twoDistricts[0]];
                var number2 = responsesObject[twoDistricts[1]];
                resultsObject[district] = (number1 + number2) / 2;
            } else {
                // Single-districts
                resultsObject[district] = responsesObject[district];
            }
            // Mitte is special
            if (district === "Berlin-Mitte") {
                resultsObject[district] = responsesObject[district];
            }
        }
        return resultsObject;
    }

    function fixEnterBehaviour(newRequest) {
        $('#searchBar').submit(function (evt) {
            evt.preventDefault();
            newRequest();
        });
    }

    return {
        chunkArray: chunkArray,
        buildResponsesObject: buildResponsesObject,
        buildResultsObject: buildResultsObject,
        fillResultsObject: fillResultsObject,
        fixEnterBehaviour: fixEnterBehaviour
    }
});