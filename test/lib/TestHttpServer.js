var express = require('express');

module.exports = function(options) {
    var app;
    var server;
    var responses = {};

    function setUpRoute(route, initialData) {
        responses[route] = initialData;

        app.get(route, function(req, res) {
            res.send(responses[route]);
        });
    }

    return {
        start: function(callback) {
            app = express();

            setUpRoute('/', '');

            server = app.listen(8000, function() {
                if (callback) {
                    callback();
                }
            });
        },
        stop: function() {
            server.close();
        },
        setResponse: function(newResponse, route) {
            route = route || '/';

            if(responses[route]) {
                responses[route] = newResponse;
            }
            else {
                setUpRoute(route, newResponse);
            }
        }
    };
};
