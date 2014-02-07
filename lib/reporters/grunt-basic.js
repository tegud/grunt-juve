(function () {
    'use strict';

    var _ = require('lodash');

    module.exports = function(grunt, runner) {
        runner.on('testRunBegin', function(options) {
            grunt.log.subhead('Executing Juve for ' + (options.tests.length) + ' ' + grunt.util.pluralize(options.tests.length, 'url/urls') + '...');
        });

        runner.on('testResult', function(results){
            var fails = results.fail.length;
            var passes = results.pass.length;
            var total = fails + passes;

            if(!total) {
                grunt.log.ok(results.url + ' passed, ' + total + ' no assertions specified.');
            }
            else if(fails) {
                grunt.log.error(results.url + ' failed, ' + fails + ' of ' + total + ' ' + grunt.util.pluralize(total, 'assertion/assertions') + ' failed.');
            }
            else {
                grunt.log.ok(results.url + ' passed, ' + total + ' ' + (grunt.util.pluralize(total, 'assertion/assertions')) + ' passed.');
            }

            _.each(results.fail, function(fail) {
                grunt.log.error('Assertion ' + fail.name + ' failed, expected: ' + fail.expected + ', was: ' + fail.actual);
            });
        });
    };
})();
