# juve

> Grunt plugin to execute juve (assertions for Phantomas) and act upon the results, e.g beacon out, write to log, etc.

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-juve --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-juve');
```

## The "grunt-juve" task

### Overview
In your project's Gruntfile, add a section named `juve` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  juve: {
    my_site: {
      options: {
        tests: [{
          url: 'http://www.tegud.net',
          assertions: {
              htmlSize: 10
          }
        }]
      }
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
0.0.1 - Initial grunt plugin version commit.

## License
Copyright (c) 2014 Steve Elliott. Licensed under the MIT license.
