/*
 * grunt-juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

'use strict';

var juve = require('juve');

module.exports = function (grunt) {
  grunt.registerMultiTask('juve', 'Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.', function () {
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    console.log('Running task...');

    juve('http://www.google.com', { }, function (results) {
        console.log('results!!!');
        done();
    });
  });
};
