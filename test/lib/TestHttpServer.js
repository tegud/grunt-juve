(function () {
    'use strict';
    var express = require('express');

    module.exports = function(options) {
        var app;
        var server;
        var response;

        return {
            start: function(callback) {
                app = express();

                app.get('/', function(req, res) {
                    res.send(response);
                });

                server = app.listen(8000, function() {
                    if (callback) {
                        callback();
                    }
                });
            },
            stop: function() {
                server.close();
            },
            setResponse: function(newResponse) {
                response = newResponse;
            }
        };
    };
})();
