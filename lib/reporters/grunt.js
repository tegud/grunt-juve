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

        function logToGrunt(grunt, url, passed, number, total) {
            var logMethod = passed ? 'ok' : 'error';
            var status = passed ? 'passed' : 'failed';
            var message = url + ' ' + status + ', ' + number + ' ' + (grunt.util.pluralize(total, 'assertion/assertions')) + ' ' + status + '.';

            grunt.log[logMethod](message);
        }

        runner.on('testResult', function(results){
            var fails = results.fail.length;
            var passes = results.pass.length;
            var total = fails + passes;

            if(!total) {
                grunt.log.ok(results.url + ' passed, no assertions specified.');
            }
            else {
                logToGrunt(grunt, results.url, !fails, fails || passes, total);
            }

            _.each(results.fail, function(fail) {
                grunt.log.error('Assertion ' + fail.name + ' failed, expected: ' + fail.expected + ', was: ' + fail.actual);
            });
        });
    };
})();
