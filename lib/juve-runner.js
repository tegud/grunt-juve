(function () {
    'use strict';
    var Promise = require('bluebird');
    var juve = require('juve');
    var _ = require('lodash');
    var EventEmitter = require('events').EventEmitter;
    var defaultOptions = {
        tests: []
    };

    module.exports = function(grunt) {
        var eventEmitter = new EventEmitter();

        return {
            on: function(event, callback) {
                eventEmitter.on(event, callback);
            },
            execute: function(options) {
                options = _.extend({}, defaultOptions, options);

                return new Promise(function(resolve, reject) {
                    if(!options.tests.length) {
                        resolve(true);
                        return;
                    }

                    var promises = _.map(options.tests, function(test) {
                        return juve(test.url, _.extend({ }, {
                                options: _.extend({}, options.juveOptions, test.juveOptions)
                            },
                            options.assertions,
                            test.assertions), function (results) {
                            results.url = test.url;
                            eventEmitter.emit('testResult', results);
                        });
                    });

                    return Promise.all(promises).then(function(results) {
                        resolve(_.every(results, function(item) {
                            return !item.fail.length;
                        }));
                    });
                });
            }
        };
    };
})();
