(function () {
    'use strict';

    var expect = require('expect.js');
    var ConfigurationLoader = require('../lib/configurationLoader');

    describe('load', function() {
        describe('given load completes', function() {
            it('then the callback is executed', function(done) {
                new ConfigurationLoader().load({}, function() {
                    done();
                });
            });

            describe('and an empty configuration is provided', function() {
                it('then sets an empty array of tests', function(done) {
                    new ConfigurationLoader().load({}, function(err, config) {
                        expect(config.tests).to.eql([]);
                        done();
                    });
                });
            });

            describe('and a configuration of tests is provided', function() {
                it('then the configuration is returned', function(done) {
                    var expectedConfiguration = {
                        tests: [{ a: 12345 }]
                    };

                    new ConfigurationLoader().load(expectedConfiguration, function(err, config) {
                        expect(config).to.eql(expectedConfiguration);
                        done();
                    });
                });
            });

            describe('and a configuration file is specified', function() {
                describe('and the configuration is json', function() {
                    it('uses the configuration from the file', function(done) {
                        new ConfigurationLoader().load({
                            file: 'test/config/test.json'
                        }, function(err, config) {
                            expect(config).to.eql({
                                file: 'test/config/test.json',
                                tests: [
                                    {
                                        url: "http://www.google.com",
                                        assertions: {
                                            htmlSize: 101
                                        }
                                    }
                                ]
                            });
                            done();
                        });
                    });
                });

                describe('and the configuration file is not present', function() {
                    it('returns an error as first argument', function(done) {
                        new ConfigurationLoader().load({
                            file: 'test/config/testNotThere.json'
                        }, function(err, config) {
                            expect(err).to.eql({
                                message: 'Could not find specified file',
                                file: 'test/config/testNotThere.json'
                            });
                            done();
                        });
                    });
                });

                describe('and the configuration file is invalid json', function() {
                    it('returns an error as first argument', function(done) {
                        new ConfigurationLoader().load({
                            file: 'test/config/invalid.json'
                        }, function(err, config) {
                            expect(err).to.eql({
                                message: 'File did not contain valid json',
                                file: 'test/config/invalid.json'
                            });
                            done();
                        });
                    });
                });
            });
        });
    });
})();
