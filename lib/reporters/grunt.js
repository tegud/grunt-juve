(function () {
    'use strict';

    var _ = require('lodash');

    module.exports = function(grunt, runner) {
        runner.on('testRunBegin', function(options) {
            if(!options.tests.length) {
                grunt.log.subhead('Executing Juve, no tests configured...');
            }
        });
    };
})();
