// Karma configuration
// Generated on 2016-05-09

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    reporters: [
      'progress',
      'coverage'
    ],

    preprocessors: {
      // 'dist/**/*.js': ['coverage']
      // This is to test the raw source code:
      'app/**/*.js': ['coverage']
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    // list of files / patterns to load in the browser
    files: [
      // 'https://kendo.cdn.telerik.com/2016.2.504/js/jquery.min.js',

      'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.js',


      // bower:js
      'bower_components/angular/angular.js',
      // endbower
      // 'https://kendo.cdn.telerik.com/2016.2.504/js/kendo.all.min.js',
      // 'dist/**/*.js',

      // 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js',

      //cdnjs.cloudflare.com/ajax/libs/angular-cookie/4.1.0/angular-cookie.min.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-sanitize.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-cookies.js',
      'https://kendo.cdn.telerik.com/2016.2.607/js/kendo.all.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/0.3.1/angular-ui-router.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.4.0/angular-animate.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.0.1/ui-bootstrap-tpls.js',
      'bower_components/angular-mocks/angular-mocks.js',


      //this is to test the raw source code
      'app/app.js',
      'app/**/*.js',

      // 'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
      '**/vendor.*.js'
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    // plugins: [
    //   'karma-phantomjs-launcher',
    //   'karma-jasmine',
    //   'karma-coverage'
    // ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
