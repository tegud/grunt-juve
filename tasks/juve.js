/*
 * grunt-juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

'use strict';

var Runner = require('../lib/juve-runner');

module.exports = function (grunt) {
  grunt.registerMultiTask('juve', 'Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.', function () {
    var done = this.async();
    var options = this.options({});
    var runner = new Runner(grunt, options);

    grunt.log.subhead('Executing Juve for ' + (options.tests.length) + ' ' + grunt.util.pluralize(options.tests.length, 'url/urls') + '...');

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
    });

    runner.execute().then(function(result) {
      if(result) {
        grunt.log.ok('All performance tests passes.');
      }
      else {
        grunt.fail.warn('Performance tests failed.');
      }

      done();
    });
  });
};
