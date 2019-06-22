define(["jquery"], function ($) {

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

    function buildObjectFromArray(array) {
        var object = {};
        for (var i = 0; i < array.length; i++) {
            object[array[i]] = null;
        }
        return object;
    }

    function fillResultsObject(responsesObject, resultsObject) {
        // Workaround for double-districts, because of Bing-Api request limit
        // In real project: Not necessary, because RPS is not limited
        // Workaround: Get two numbers, make average

        for (var district in resultsObject) {
            // Mitte is special
            if (district === "Berlin-Mitte") {
                resultsObject[district] = responsesObject[district];
            }
            // Identify double district (-)
            else if (district.indexOf("-") !== -1) {
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
        }
        return resultsObject;
    }

    function sendRequestsWithEnter(newRequest) {
        $("#searchBar").submit(function (evt) {
            evt.preventDefault();
            newRequest();
            // Hide onscreen keyboard after hitting enter
            $("#query").blur();
        });
    }

    function showLoading() {
        $("#submit > i").addClass("d-none");
        $("#submit > span").removeClass("d-none");
    }

    function hideLoading() {
        $("#submit > span").addClass("d-none");
        $("#submit > i").removeClass("d-none");
    }

    return {
        chunkArray: chunkArray,
        buildObjectFromArray: buildObjectFromArray,
        fillResultsObject: fillResultsObject,
        sendRequestsWithEnter: sendRequestsWithEnter,
        showLoading: showLoading,
        hideLoading: hideLoading
    }
});