(function () {
    'use strict';
    var Promise = require('bluebird');
    var juve = require('juve');
    var _ = require('lodash');
    var defaultOptions = {
        reporters: []
    };

    module.exports = function(grunt, options) {
        options = _.extend({}, defaultOptions, options);

        return {
            test: function(url, testOptions) {
                return new Promise(function(resolve, reject) {
                    juve(url, testOptions || {}, function (results) {
                        if(options.reporters.length) {
                            options.reporters.forEach(function(reporter) {
                                reporter.results(results);
                            });
                        }

                        resolve(results);
                    });
                });
            }
        };
    };
})();
