(function () {
    'use strict';
    var Runner = require('../lib/juve-runner');
    var expect = require('expect.js');
    var TestServer = require('./lib/TestHttpServer');
    var TestReporter = require('./lib/TestReporter');


    describe('juve-runner', function () {
        var httpServer = new TestServer();

        before(function(done) {
            httpServer.start(done);
        });

        after(function() {
            httpServer.stop();
        });

        describe('executes test for a single url', function() {
            it('passes if performance assertions met', function(done) {
                var juveRunner = new Runner();

                httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                juveRunner.test('http://localhost:8000').then(function(results) {
                    expect(results.fail.length).to.be(0);
                    done();
                });
            });

            it('fails if performance assertions are not met', function(done) {
                var juveRunner = new Runner();

                httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                juveRunner.test('http://localhost:8000', {
                    htmlSize: 10
                }).then(function(results) {
                    expect(results.fail[0]).to.eql({ name: 'htmlSize', expected: 10, actual: 54 });
                    done();
                });
            });

            it('passes the results to a single reporter', function(done) {
                var juveRunner = new Runner({
                    reporters: [new TestReporter(function(results) {
                        expect(results.fail[0]).to.eql({ name: 'htmlSize', expected: 10, actual: 54 });
                        done();
                    })]
                });

                httpServer.setResponse('<!DOCTYPE html><html><head></head><body></body></html>');

                juveRunner.test('http://localhost:8000', {
                    htmlSize: 10
                });
            });
        });

        describe('executes test for a single url', function() {

        });
    });
})();
