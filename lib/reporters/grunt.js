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
    };
})();
