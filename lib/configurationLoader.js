(function () {
    'use strict';

    var _ = require('lodash');
    var fs = require('fs');

    module.exports = function() {
        return {
            load: function(config, callback) {
                if(config.file) {
                    fs.readFile(__dirname + '/' + config.file, 'utf8', function (err,data) {
                        var error;
                        var fileConfig;

                        if (err) {
                            error = {
                                message: 'Could not find specified file',
                                file: config.file
                            };
                        }
                        else {
                            try {
                                fileConfig = _.extend({}, config, JSON.parse(data));
                            }
                            catch(e) {
                                error = {
                                    message: 'File did not contain valid json',
                                    file: config.file
                                };
                            }
                        }

                        callback(error, fileConfig);
                    });
                }
                else {
                    callback(undefined, _.extend({}, {
                        tests: []
                    }, config));
                }
            }
        };
    };
})();
