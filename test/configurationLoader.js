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
                    new ConfigurationLoader().load({}, function(config) {
                        expect(config.tests).to.eql([]);
                        done();
                    });
                });
            });
        });
    });
})();
