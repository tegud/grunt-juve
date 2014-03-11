/*
 * juve
 * 
 *
 * Copyright (c) 2014 Steve Elliott
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/**/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
        globals: [
            'describe',
            'it'
        ]
      }
    },
    mochacli: {
      src: ['test/**/*.js'],
        options: {
          timeout: 10000,
          ignoreLeaks: false,
          ui: 'bdd',
          reporter: 'spec'
        }
    },
    juve: {
      'tegud': {
        options: {
            tests: [{
                url: 'http://www.gruntjs.com',
                assertions: {
                    htmlSize: 10310
                }
            }]
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['jshint', 'mochacli']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['juve']);

};
