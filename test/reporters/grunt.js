(function () {
    'use strict';

    var expect = require('expect.js');
    var reporter = require('../../lib/reporters/grunt');
    var EventEmitter = require('events').EventEmitter;
    var _ = require('lodash');
    var grunt = _.extend({
        fail: {},
        log: {}
    }, require('grunt'));

    describe('given testRunBegin event is emitted', function() {
        describe('and no tests have been configured', function() {
            it('then it writes sub header indicating there are no tests', function() {
                var actualMessage;
                var expectedMessage = 'Executing Juve, no tests configured...';
                var eventEmitter = new EventEmitter();

                grunt.log.subhead = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testRunBegin', { tests: [] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });

        describe('and one test has been configured', function() {
            it('then it writes sub header indicating there is one test', function() {
                var actualMessage;
                var expectedMessage = 'Executing Juve, 1 test...';
                var eventEmitter = new EventEmitter();

                grunt.log.subhead = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testRunBegin', { tests: [{}] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });

        describe('and two tests have been configured', function() {
            it('then it writes sub header indicating there are two tests', function() {
                var actualMessage;
                var expectedMessage = 'Executing Juve, 2 tests...';
                var eventEmitter = new EventEmitter();

                grunt.log.subhead = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testRunBegin', { tests: [{}, {}] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });
    });



    describe('given an error is raised', function() {
        it('then it writes error message to the log', function() {
            var actualMessage;
            var expectedMessage = 'Could not find file';
            var eventEmitter = new EventEmitter();

            grunt.fail.warn = function() {};

            grunt.log.error = function(message) {
                actualMessage = message;
            };

            new reporter(grunt, eventEmitter);

            eventEmitter.emit('error', { message: expectedMessage });

            expect(actualMessage).to.be(expectedMessage);
        });

        it('then it fails grunt with a general message', function() {
            var actualMessage;
            var expectedMessage = 'Juve failed due to error(s)';
            var eventEmitter = new EventEmitter();

            grunt.fail.warn = function(message) {
                actualMessage = message;
            };

            new reporter(grunt, eventEmitter);

            eventEmitter.emit('error', { message: expectedMessage });

            expect(actualMessage).to.be(expectedMessage);
        });
    });

    describe('given a test result is completed', function() {
        describe('and the test had no assertions', function() {
            it('then  a message is logged indicating pass with no assertions', function() {
                var actualMessage;
                var expectedMessage = 'http://www.google.com passed, no assertions specified.';
                var eventEmitter = new EventEmitter();

                grunt.log.ok = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testResult', { url: 'http://www.google.com', fail: [], pass: [] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });

        describe('and the test had one passing assertion', function() {
            it('then a message is logged indicating a single assertion has passed', function() {
                var actualMessage;
                var expectedMessage = 'http://www.google.com passed, 1 assertion passed.';
                var eventEmitter = new EventEmitter();

                grunt.log.ok = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testResult', { url: 'http://www.google.com', fail: [], pass: [{}] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });

        describe('and the test had two passing assertions', function() {
            it('then a message is logged indicating two assertions have passed', function() {
                var actualMessage;
                var expectedMessage = 'http://www.google.com passed, 2 assertions passed.';
                var eventEmitter = new EventEmitter();

                grunt.log.ok = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testResult', { url: 'http://www.google.com', fail: [], pass: [{}, {}] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });

        describe('and the est had one failing assertions', function() {
            it('then a message is logged indicating one assertion has failed', function() {
                var actualMessage;
                var expectedMessage = 'http://www.google.com failed, 1 assertion failed.';
                var eventEmitter = new EventEmitter();

                grunt.log.error = function(message) {
                    actualMessage = message;
                };

                new reporter(grunt, eventEmitter);

                eventEmitter.emit('testResult', { url: 'http://www.google.com', fail: [{}], pass: [] });

                expect(actualMessage).to.be(expectedMessage);
            });
        });
    });
})();