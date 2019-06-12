define(["jquery", "bootstrap"], function ($) {
    return function () {
        $('p').append('loaded');
        $('[data-toggle="tooltip"]').tooltip();
    }
});