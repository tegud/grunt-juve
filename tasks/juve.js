/*
 * grunt-juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

'use strict';

var Runner = require('../lib/juve-runner');
var BasicReporter = require('../lib/reporters/grunt-basic');
var _ = require('lodash');

module.exports = function (grunt) {
  grunt.registerMultiTask('juve', 'Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.', function () {
    var done = this.async();
    var runner = new Runner(grunt);

    new BasicReporter(grunt, runner);

    runner.execute(this.options()).then(done);
  });
};
