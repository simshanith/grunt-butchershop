# grunt-butchershop [![Build Status](https://travis-ci.org/simshanith/grunt-butchershop.svg?branch=master)](https://travis-ci.org/simshanith/grunt-butchershop) [![Dependency Status](https://david-dm.org/simshanith/grunt-butchershop.svg)](https://david-dm.org/simshanith/grunt-butchershop) [![devDependency Status](https://david-dm.org/simshanith/grunt-butchershop/dev-status.svg)](https://david-dm.org/simshanith/grunt-butchershop#info=devDependencies)

> Proxy remote server with local assets.

[![NPM](https://nodei.co/npm/grunt-butchershop.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-butchershop/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-butchershop --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-butchershop');
```

## The "butchershop" task

### Overview
In your project's Gruntfile, add a section named `butchershop` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  butchershop: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

Butchershop delegates to Hapi for most requests. Current Butchershop `v0.0.6` uses Hapi `~0.15.6`:
<https://github.com/spumko/hapi/blob/v0.15.6/docs/Reference.md>

Especially relevant are:

#### local
Type: `Object`
Default: `{}`

#### proxy
Type: `Object`
Default: `{}`

---------------------------------------

Additionally, the plugin uses the following options to configure other aspects of the task:

#### chop
Type: `Object`
Default: `{}`

Key-value pairs of server paths to chop to local paths. Keys are server HTTP path; values are the local file path with `Gruntfile` directory as `cwd`. E.g:

```js
grunt.initConfig({
  butchershop: {
    main: {
     options: {
      chop: {
      '/stylus/{path*}':  './test/fixtures/stylus-local'
    }
   }
  }
}
});
```

#### open
Type: `String | Boolean`
Default: `false`

If `true`, opens the browser to the public tunnel page. If a string, the option is treated as a path, eg:

```js
grunt.initConfig({
  butchershop: {
    main: {
     options: {
      open: 'path/'
   }
  }
}
});
```
...should expect to open `http://localhost:8000/path/` upon launch.

#### keepalive
Type: `Boolean`  
Default: `false`

Keep the server alive indefinitely. Note that if this option is enabled, any tasks specified after this task will _never run_. By default, once grunt's tasks have completed, the web server stops. This option changes that behavior.

This option can also be enabled ad-hoc by running the task like `grunt butchershop:targetname:keepalive`


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### v0.1.1
- Improved `open` functionality. Needs refinement in Butchershop to not have race condition.

### v0.1.0
- Initial Release


## License
Copyright (c) 2014 Shane Daniel. Licensed under the MIT license.
