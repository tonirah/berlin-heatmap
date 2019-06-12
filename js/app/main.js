define(["app/map", "app/bootstrapTest", "app/search"], function (map, bootstrap, search) {
    map.initialize();
    bootstrap();

    var result = ["abc"];
    search.simpleQuery("Kreuzberg", result);

    console.log("Unmittelbar in main: "+ result);

    setTimeout(function(){
        console.log("Nach 3s in main: " + result);
    }, 3000);
});