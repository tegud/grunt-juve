(function () {
    'use strict';
    var config;
    var proxyquire = require('proxyquire');
    var Runner =
        proxyquire('../lib/juve-runner', {
            './configurationLoader': function() {
                return {
                    load: function(inputConfig, callback) {
                        callback(config || inputConfig);
                    }
                };
            }
        });
    var expect = require('expect.js');
    var TestServer = require('./lib/TestHttpServer');
    var grunt = require('grunt');
    var _ = require('lodash');

    describe('juve-runner', function () {
        var httpServer = new TestServer();

        before(function(done) {
            httpServer.start(done);
        });

        after(function() {
            httpServer.stop();
        });

        describe('execute', function() {
            describe('given testRunBegin event is emitted', function() {
                it('then options from configurationLoader are provided', function(done) {
                    var expectedOptions = { abcd: 1234, tests: [] };
                    var runner = new Runner(grunt);

                    config = expectedOptions;

                    runner.on('testRunBegin', function(options) {
                        expect(options).to.be(expectedOptions);
                        done();
                    });

                    runner.execute();
                });
            });

            describe('given no tests have been configured', function() {
                it('then true is returned once complete', function(done) {
                    new Runner(grunt).execute().then(function(result) {
                        expect(result).to.be(true);
                        done();
                    });
                });

                describe('and testRunComplete event is emitted', function() {
                    it('then true is provided', function(done) {
                        var runner = new Runner(grunt);

                        runner.on('testRunComplete', function(result) {
                            expect(result).to.be(true);
                            done();
                        });

                        runner.execute();
                    });
                });
            });

            describe('given configurationLoader returns a different config than the one provided', function() {
                it('uses the test url returned from the configurationLoader', function(done) {
                    var runner = new Runner(grunt);
                    var actualUrl;
                    var expectedUrl = 'http://localhost:8000/';

                    runner.on('testResult', function(results) {
                        actualUrl = results.url;
                    });

                    config = {
                        tests: [
                            {
                                url: expectedUrl
                            }
                        ]
                    };

                    runner.execute({
                        file: 'override.json'
                    }).then(function() {
                        expect(actualUrl).to.be(expectedUrl);
                        done();
                    });
                });
            });

            describe('given one passing test and one failing test with global assertion have been configured', function() {
                var allResults;
                var runner;

                before(function(done) {
                    config = false;
                    allResults = [];
                    runner = new Runner(grunt);

                    runner.on('testResult', function(results) {
                        allResults.push(results);
                    });

                    runner.execute({
                        juveOptions: {
                            trials: 2
                        },
                        assertions: {
                            htmlSize: 10
                        },
                        tests: [
                            { url: 'http://localhost:8000/One' },
                            {
                                url: 'http://localhost:8000/Two',
                                juveOptions: {
                                    trials: 1
                                },
                                assertions: {
                                    htmlSize: 100
                                }
                            }
                        ]
                    }).then(function() {
                        done();
                    });

                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>One</h1></body></html>', '/One');
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>Two</h1></body></html>', '/Two');
                });

                describe('then testResult event is emitted', function() {
                    it('with one fail', function() {
                        expect(_.where(allResults, function(result) {
                            return result.fail.length;
                        }).length).to.be(1);
                    });

                    it('with one pass', function() {
                        expect(_.where(allResults, function(result) {
                            return result.pass.length;
                        }).length).to.be(1);
                    });

                    it('with result url', function() {
                        expect(_.where(allResults, function(result) {
                            return result.pass.length;
                        })[0].url).to.be('http://localhost:8000/Two');
                    });
                });

                it('then global assertions are used', function() {
                    expect(_.where(allResults, function(result) {
                        return result.fail.length;
                    })[0].fail[0].expected).to.be(10);
                });

                it('then test level assertions are used', function() {
                    expect(_.where(allResults, function(result) {
                        return result.pass.length;
                    })[0].pass[0].expected).to.be(100);
                });

                it('then global configured juve options are used', function() {
                    expect(_.where(allResults, function(result) {
                        return result.fail.length;
                    })[0].trials.length).to.be(2);
                });

                it('then test level juve options are used', function() {
                    expect(_.where(allResults, function(result) {
                        return result.pass.length;
                    })[0].trials.length).to.be(1);
                });
            });
        });
    });
})();
