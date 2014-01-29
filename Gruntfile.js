/*
 * juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      }
    },
    mochacli: {
      src: ['test/**/*.js'],
        options: {
          timeout: 6000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
    },
    juve: {
      'to-console': {
        options: { }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['mochacli']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
