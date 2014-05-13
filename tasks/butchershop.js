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

    grunt.log.ok('Starting butchershop...');
    butcher.start();

    // Butchershop populates passed options with defaults, so this is safe.
    var butcherUrl = ['http://', options.local.host, ':', options.local.port].join('');
    grunt.verbose.writeln('Constructing open url using base: %s', butcherUrl);

    if( options.open === true ) {
      open(butcherUrl);
    } else if ( _.isString(options.open) ) {
      // need to ensure leading slash.
      open(butcherUrl+ensureLeadingSlash(options.open));
    }

    if( !keepAlive ) {
      done();
    }

  });

};
