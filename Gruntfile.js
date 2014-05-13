/*
 * grunt-butchershop
 * https://github.com/simshanith/grunt-butchershop
 *
 * Copyright (c) 2014 Shane Daniel
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  // load all npm grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
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

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    butchershop: {
      example: {
        options: {
          chop: {
            '/stylus/{path*}': './test/fixtures/stylus-local'
          }
        }
      },
      open: {
        options: {
          chop: {
            '/stylus/{path*}': './test/fixtures/stylus-local'
          },
          keepalive: true,
          open: 'package/grunt-butchershop'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
      options: {
        reporter: 'verbose'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, launch the server then run tests.
  // TODO: write tests.it
  grunt.registerTask('test', ['butchershop:example', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
