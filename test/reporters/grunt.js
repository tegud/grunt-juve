(function () {
    'use strict';

    var expect = require('expect.js');
    var reporter = require('../../lib/reporters/grunt');
    var EventEmitter = require('events').EventEmitter;
    var grunt = require('grunt');

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

        describe('an error is raised', function() {
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
    });
})();
