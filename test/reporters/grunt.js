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
    });
})();
