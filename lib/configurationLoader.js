var _ = require('lodash');
var fs = require('fs');
var grunt = require('grunt');

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
                return __dirname + '/../' + filePath;
            }

            if(config.file) {
                var error;
                var fileConfig;

                try{
                    fileConfig = grunt.file.readJSON(buildFullPath(config.file));
                }
                catch(e) {
                    if(e.origError.code === 'ENOENT') {
                        error = createError('Could not find specified file');
                    }
                    else {
                        error = createError('File did not contain valid json');
                    }
                }

                if(!fileConfig && !error) {
                    error = createError('File did not contain valid json');
                }

                callback(error, _.extend({}, config, fileConfig));
            }
            else {
                callback(undefined, _.extend({}, {
                    tests: []
                }, config));
            }
        }
    };
};
