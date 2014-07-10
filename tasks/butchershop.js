/*
 * grunt-butchershop
 * https://github.com/simshanith/grunt-butchershop
 *
 * Copyright (c) 2014 Shane Daniel
 * Licensed under the MIT license.
 */

'use strict';

var Butchershop = require('butchershop');
var open = require('open');
var _ = require('lodash');

module.exports = function (grunt) {

  // Matches leading slash.
  var leadingSlashRegex = /^\//;
  // Trim leading slash.
  function trimLeadingSlash(url) {
    if( _.isString(url) ) {
      return url.replace(leadingSlashRegex, '');
    }
  }

  // Unshifts a slash if present then shifts one.
  // Yay idempotency.
  function ensureLeadingSlash(path) {
    if( _.isString(path) ) {
      return '/'+trimLeadingSlash(path);
    }
  }

  grunt.registerMultiTask('butchershop', 'Proxy remote server with local assets.', function () {

    var task = this;

    var done = task.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var defaults = {
      local: {},
      proxy: {},
      chop: {},
      open: false,
      keepalive: false
    };

    var options = task.options(defaults);
    var keepAlive = task.flags.keepalive || options.keepalive;

    var taskSpecificOptions = ['chop', 'keepalive', 'open'];
    var butcher = new Butchershop(_.omit(options, taskSpecificOptions));

    if( !_.isEmpty(options.chop) ) {
      grunt.log.ok('Chopping local assets...');

      _.each(options.chop, function(localPath, serverPath) {
        grunt.verbose.ok('Chopping %s to %s', serverPath, localPath);
        butcher.chop(serverPath, localPath);
      });
    }

    butcher.server.on('start', function() {
        function openButchershop() {
          // Butchershop populates passed options with defaults, so this should be safe.
          var butcherUrl = ['http://', options.local.host, ':', options.local.port].join('');

          grunt.verbose.writeln('Constructing open url using base: %s', butcherUrl);

          if( _.isString(options.open )) {
              butcherUrl += ensureLeadingSlash(options.open);
          }

          grunt.log.ok('Opening default browser: %s', butcherUrl);
          open(butcherUrl);
        }
        if( options.open === true || _.isString(options.open) ) {
        // hacky
        _.delay(openButchershop, 200);
      }

      if( !keepAlive ) {
        done();
      }
    });

    grunt.log.ok('Starting butchershop...');
    butcher.start(function() {
      butcher.server.emit('start');
    });

  });

};
