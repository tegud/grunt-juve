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

        describe('test for a single url', function() {
            it('passes if performance assertions met', function(done) {
                var juveRunner = new Runner(grunt);

                httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                juveRunner.test('http://localhost:8000').then(function(results) {
                    expect(results.fail.length).to.be(0);
                    done();
                });
            });

            it('fails if performance assertions are not met', function(done) {
                var juveRunner = new Runner(grunt);

                httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                juveRunner.test('http://localhost:8000', {
                    htmlSize: 10
                }).then(function(results) {
                    expect(results.fail[0]).to.eql({ name: 'htmlSize', expected: 10, actual: 54 });
                    done();
                });
            });

            describe('when test has completed', function() {
                it('emits testResult event', function(done) {
                    var runner = new Runner(grunt);

                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                    runner.on('testResult', function(results) {
                        expect(results.fail[0]).to.eql({ name: 'htmlSize', expected: 10, actual: 54 });
                        done();
                    });

                    runner.test('http://localhost:8000', {
                        htmlSize: 10
                    });
                });
            });
        });

        describe('execute runs', function() {
            describe('when no tests have been configured', function() {
                it('true is returned once complete', function(done) {
                    var runner = new Runner(grunt, {
                        tests: []
                    }).execute().then(function(result) {
                        expect(result).to.be(true);
                        done();
                    });
                });
            });

            describe('when one failing test has been configured', function() {
                describe('emits testResult event', function() {
                    it('with one fail', function(done) {
                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                        var runner = new Runner(grunt, {
                            tests: [
                                {
                                    url: 'http://localhost:8000',
                                    assertions: {
                                        htmlSize: 10
                                    }
                                }
                            ]
                        });

                        runner.on('testResult', function(results) {
                            expect(results.fail[0]).to.eql({ name: 'htmlSize', expected: 10, actual: 54 });
                        });

                        runner.execute().then(function() {
                            done();
                        });
                    });

                    it('with url', function(done) {
                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                        var runner = new Runner(grunt, {
                            tests: [
                                {
                                    url: 'http://localhost:8000',
                                    assertions: {
                                        htmlSize: 10
                                    }
                                }
                            ]
                        });

                        runner.on('testResult', function(results) {
                            expect(results.url).to.be('http://localhost:8000');
                        });

                        runner.execute().then(function() {
                            done();
                        });
                    });
                });

                it('false is returned on completion', function(done) {
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                    new Runner(grunt, {
                        tests: [
                            {
                                url: 'http://localhost:8000',
                                assertions: {
                                    htmlSize: 10
                                }
                            }
                        ]
                    }).execute().then(function(result) {
                        expect(result).to.be(false);
                        done();
                    });
                });
            });

            describe('when one passing test has been configured', function() {
                describe('emits testResult event', function() {
                    it('with one pass', function(done) {
                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                        var runner = new Runner(grunt, {
                            tests: [
                                {
                                    url: 'http://localhost:8000',
                                    assertions: {
                                        htmlSize: 100
                                    }
                                }
                            ]
                        });

                        runner.on('testResult', function(results) {
                            expect(results.pass[0]).to.eql({ name: 'htmlSize', expected: 100, actual: 54 });
                        });

                        runner.execute().then(function() {
                            done();
                        });
                    });

                    it('with url', function(done) {
                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                        var runner = new Runner(grunt, {
                            tests: [
                                {
                                    url: 'http://localhost:8000',
                                    assertions: {
                                        htmlSize: 100
                                    }
                                }
                            ]
                        });

                        runner.on('testResult', function(results) {
                            expect(results.url).to.be('http://localhost:8000');
                        });

                        runner.execute().then(function() {
                            done();
                        });
                    });
                });

                it('false is returned on completion', function(done) {
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                    new Runner(grunt, {
                        tests: [
                            {
                                url: 'http://localhost:8000',
                                assertions: {
                                    htmlSize: 100
                                }
                            }
                        ]
                    }).execute().then(function(result) {
                        expect(result).to.be(true);
                        done();
                    });
                });
            });

            describe('when two passing tests have been configured', function() {
                describe('emits testResult event', function() {
                    it('with two passes', function(done) {
                        var allResults = [];

                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>One</h1></body></html>', '/One');
                        httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>Two</h1></body></html>', '/Two');

                        var runner = new Runner(grunt, {
                            tests: [
                                {
                                    url: 'http://localhost:8000/One',
                                    assertions: {
                                        htmlSize: 100
                                    }
                                },
                                {
                                    url: 'http://localhost:8000/Two',
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
                            expect(allResults.length).to.be(2);
                            done();
                        });
                    });
                });

                it('true is returned on completion', function(done) {
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>One</h1></body></html>', '/One');
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>Two</h1></body></html>', '/Two');

                    new Runner(grunt, {
                        tests: [
                            {
                                url: 'http://localhost:8000/One',
                                assertions: {
                                    htmlSize: 100
                                }
                            },
                            {
                                url: 'http://localhost:8000/Two',
                                assertions: {
                                    htmlSize: 100
                                }
                            }
                        ]
                    }).execute().then(function(result) {
                        expect(result).to.be(true);
                        done();
                    });
                });
            });
        });

        describe('when one passing test and one failing test with global assertion have been configured', function() {
            describe('emits testResult event', function() {
                it('with one fail', function(done) {
                    var allResults = [];

                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>One</h1></body></html>', '/One');
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body><h1>Two</h1></body></html>', '/Two');

                    var runner = new Runner(grunt, {
                        assertions: {
                            htmlSize: 10
                        },
                        tests: [
                            { url: 'http://localhost:8000/One' },
                            {
                                url: 'http://localhost:8000/Two',
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
                        expect(_.where(allResults, function(result) {
                            return result.fail.length;
                        }).length).to.be(1);
                        done();
                    });
                });
            });
        });

        describe('when one passing test configured for one trial', function() {
            describe('emits testResult event', function() {
                it('with one trial executed', function(done) {
                    httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                    var runner = new Runner(grunt, {
                        juveOptions: {
                            trials: 1
                        },
                        assertions: { htmlSize: 100 },
                        tests: [{ url: 'http://localhost:8000/One' }]
                    });

                    runner.on('testResult', function(results) {
                        expect(results.trials.length).to.be(1);
                    });

                    runner.execute().then(function() {
                        done();
                    });
                });
            });
        });
    });
})();
