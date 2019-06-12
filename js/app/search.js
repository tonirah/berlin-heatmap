define(["jquery"], function ($) {

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

    function simpleQuery(query, result) {
        var key = encryptKey();
        var params = {
            // Request parameters
            "q": "Kreuzberg",
            "mkt": "de_DE"
        };
        $.ajax({
            url: "https://api.cognitive.microsoft.com/bing/v7.0/search?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", key);
            },
            type: "GET",
            // Request body
            data: "{body}"
        })
            .done(function(data) {
                var numberOfResults;

                if(data.hasOwnProperty('webPages')) {
                    numberOfResults = data.webPages.totalEstimatedMatches;
                } else {
                    numberOfResults = 0;
                }
                console.log(numberOfResults);

                result.push(numberOfResults);

                console.log("Result in callback: "+ result);
            })
            .fail(function() {
                result.push("no data received")
            });
    }

    return {
        simpleQuery: simpleQuery
    }
});