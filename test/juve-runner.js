(function () {
    'use strict';
    var Runner = require('../lib/juve-runner');
    var expect = require('expect.js');
    var TestServer = require('./lib/TestHttpServer');
    var TestReporter = require('./lib/TestReporter');
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

        describe('execute runs', function() {
            describe('when no tests have been configured', function() {
                it('true is returned once complete', function(done) {
                    new Runner(grunt).execute().then(function(result) {
                        expect(result).to.be(true);
                        done();
                    });
                });
            });

            describe('when one passing test and one failing test with global assertion have been configured', function() {
                var allResults;
                var runner;

                before(function(done) {
                    allResults = [];
                    runner = new Runner(grunt, {
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
                    });

                    runner.on('testResult', function(results) {
                        allResults.push(results);
                    });

                    runner.execute().then(function() {
                        done();
                    });

                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>One</h1></body></html>', '/One');
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>Two</h1></body></html>', '/Two');
                });

                describe('emits testResult event', function() {
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

                it('uses global assertions', function() {
                    expect(_.where(allResults, function(result) {
                        return result.fail.length;
                    })[0].fail[0].expected).to.be(10);
                });

                it('uses test level assertions', function() {
                    expect(_.where(allResults, function(result) {
                        return result.pass.length;
                    })[0].pass[0].expected).to.be(100);
                });

                it('uses the global configured juve options', function() {
                    expect(_.where(allResults, function(result) {
                        return result.fail.length;
                    })[0].trials.length).to.be(2);
                });

                it('uses the test level juve options', function() {
                    expect(_.where(allResults, function(result) {
                        return result.pass.length;
                    })[0].trials.length).to.be(1);
                });
            });
        });
    });
})();
