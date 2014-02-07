(function () {
    'use strict';

    var _ = require('lodash');
    var fs = require('fs');

    module.exports = function() {
        return {
            load: function(config, callback) {
                if(config.file) {
                    fs.readFile(__dirname + '/' + config.file, 'utf8', function (err,data) {
                        if (err) {
                        }

                        var fileConfig = JSON.parse(data);

                        callback(_.extend({}, config, fileConfig));
                    });
                }
                else {
                    callback(_.extend({}, {
                        tests: []
                    }, config));
                }
            }
        };
    };
})();
