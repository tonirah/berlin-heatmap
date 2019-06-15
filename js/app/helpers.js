define(["app/districts"], function (districts) {

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

    function buildResultsObject() {
        var arrayOfLocalities = districts.arrayOfDistricts;
        var resultsObject = {};
        for (var i = 0; i < arrayOfLocalities.length; i++) {
            resultsObject[arrayOfLocalities[i]] = null;
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
        buildResultsObject: buildResultsObject,
        fixEnterBehaviour: fixEnterBehaviour
    }
});