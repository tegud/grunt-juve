/*
 * grunt-juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

var Runner = require('../lib/juve-runner');
var BasicReporter = require('../lib/reporters/grunt');
var _ = require('lodash');
var juve = require('juve');

module.exports = function (grunt) {
  grunt.registerMultiTask('juve', 'Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.', function () {
    var done = this.async();
    var runner = new Runner(grunt);

    new BasicReporter(grunt, runner);

    runner.execute(this.options()).finally(done);
  });
};
