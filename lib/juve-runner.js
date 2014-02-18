(function () {
    'use strict';
    var Promise = require('bluebird');
    var juve = require('juve');
    var _ = require('lodash');
    var EventEmitter = require('events').EventEmitter;
    var ConfigurationLoader = require('./configurationLoader');
    var defaultOptions = {
        tests: []
    };

    module.exports = function(grunt) {
        var eventEmitter = new EventEmitter();
        var configurationLoader = new ConfigurationLoader();

        return {
            on: function(event, callback) {
                eventEmitter.on(event, callback);
            },
            execute: function(options) {
                return new Promise(function(resolve, reject) {
                    configurationLoader.load(options, function(err, options) {
                        if(err) {
                            eventEmitter.emit('error', err);
                            reject();
                            return;
                        }

                        eventEmitter.emit('testRunBegin', options);

                        if(!options.tests.length) {
                            eventEmitter.emit('testRunComplete', true);
                            resolve(true);
                            return;
                        }

                        var promises = _.map(options.tests, function(test) {
                            var testOptions = _.extend({ }, {
                                    options: _.extend({}, options.juveOptions, test.juveOptions)
                                },
                                options.assertions,
                                test.assertions);

                            return juve(test.url, testOptions, function (results) {
                                results.url = test.url;
                                eventEmitter.emit('testResult', results);
                            });
                        });

                        return Promise.all(promises).then(function(results) {
                            resolve(_.every(results, function(item) {
                                var passed = !item.fail.length;

                                eventEmitter.emit('testRunComplete', passed);

                                return passed;
                            }));
                        });
                    });
                });
            }
        };
    };
})();
