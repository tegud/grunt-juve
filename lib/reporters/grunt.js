var _ = require('lodash');

function logToGrunt(grunt, url, passed, number, total) {
    var logMethod = passed ? 'ok' : 'error';
    var status = passed ? 'passed' : 'failed';
    var message = url + ' ' + status + ', ' + number + ' out of ' + total + ' ' + (grunt.util.pluralize(total, 'assertion/assertions')) + ' ' + status + '.';

    grunt.log[logMethod](message);
}

module.exports = function(grunt, runner) {
    var totalPasses = 0;
    var totalFails = 0;

    runner.on('testRunBegin', function(options) {
        totalPasses = 0;
        totalFails = 0;

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

        if(fails) {
            totalFails++;
        }
        else {
            totalPasses++;
        }

        if(!total) {
            grunt.log.ok(results.url + ' passed, no assertions specified.');
        }
        else {
            logToGrunt(grunt, results.url, !fails, fails || passes, total);
        }

        _.each(results.fail, function(fail) {
            grunt.log.error('Assertion ' + fail.name + ' failed, expected: ' + fail.expected + ', was: ' + fail.actual);
        });

        _.each(results.pass, function(pass) {
            grunt.verbose.ok('Assertion ' + pass.name + ' passed, expected: ' + pass.expected + ', was: ' + pass.actual);
        });
    });

    runner.on('testRunComplete', function(result) {
        if(result) {
            grunt.log.ok('All performance tests passes.');
        }
        else {
            if(totalFails) {
                grunt.fail.warn(totalFails + '/' + (totalFails + totalPasses) + ' Performance tests failed.');
            }
            else {
                grunt.fail.warn('Performance tests failed.');
            }
        }
    });
};
