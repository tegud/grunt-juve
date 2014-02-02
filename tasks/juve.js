/*
 * grunt-juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

'use strict';

var juve = require('juve');
var Runner = require('../lib/juve-runner');

module.exports = function (grunt) {
  grunt.registerMultiTask('juve', 'Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.', function () {
    var done = this.async();
    var runner = new Runner(grunt);

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    console.log('Running task...');

    runner.test('http://www.laterooms.com', {
        htmlSize: 10
    }).then(function(results) {
        if(results.fail.length) {
            grunt.fail.warn('Url failed one or more performance assertions.');
        }

        done();
    });
  });
};
