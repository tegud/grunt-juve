(function () {
    'use strict';

    var _ = require('lodash');

    module.exports = function(grunt, runner) {
        runner.on('testRunBegin', function(options) {
            if(!options.tests.length) {
                grunt.log.subhead('Executing Juve, no tests configured...');
                return;
            }

            grunt.log.subhead('Executing Juve, ' + (options.tests.length) + ' ' + grunt.util.pluralize(options.tests.length, 'test/tests') + '...');
        });

        runner.on('error', function(err) {
            grunt.log.error(err.message);
            grunt.fail.warn('Juve failed due to error(s)');
        });

        runner.on('testResult', function(results){
            var fails = results.fail.length;
            var passes = results.pass.length;
            var total = fails + passes;

            if(!total) {
                grunt.log.ok(results.url + ' passed, no assertions specified.');
            }
            else if(fails) {
                grunt.log.error(results.url + ' failed, ' + fails + ' ' + (grunt.util.pluralize(total, 'assertion/assertions')) + ' failed.');
            }
            else {
                grunt.log.ok(results.url + ' passed, ' + total + ' ' + (grunt.util.pluralize(total, 'assertion/assertions')) + ' passed.');
            }
        });
    };
})();
