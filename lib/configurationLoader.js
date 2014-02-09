(function () {
    'use strict';

    var _ = require('lodash');
    var fs = require('fs');

    module.exports = function() {
        return {
            load: function(config, callback) {
                function createError(message) {
                    return {
                        message: message,
                        file: config.file
                    };
                }

                function buildFullPath(filePath) {
                    return __dirname + '/' + filePath;
                }

                if(config.file) {
                    fs.readFile(buildFullPath(config.file), 'utf8', function (err,data) {
                        var error;
                        var fileConfig;

                        if (err) {
                            error = createError('Could not find specified file');
                        }
                        else {
                            try {
                                fileConfig = _.extend({}, config, JSON.parse(data));
                            }
                            catch(e) {
                                error = createError('File did not contain valid json');
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
