// Karma configuration
// Generated on Sat Nov 14 2015 22:37:58 GMT+1100 (AEDT)


var _ = require('underscore');


/**
 * This function returns a list of js/html files 
 * to be loaded to karma runner
 */
function filesArray(){

    var vendorJsFiles = require('./vendor.json');

    var mockJsFiles = [
        'bower_components/angular-mocks/angular-mocks.js'
    ];

    var appJsFiles = [
      'app/scripts/**/*.js',
      'test/unit/**/*.js'
    ];

    var htmlFiles = ['app/templates/**/*.html'];

    return _.union(vendorJsFiles, mockJsFiles, appJsFiles, htmlFiles);
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: filesArray(),


    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'app/scripts/**/*.js': ['coverage'],
        'app/templates/**/*.html': ['ng-html2js']
    },

    // settings for ng-html2js preprocessor
    ngHtml2JsPreprocessor: {
        stripPrefix: 'app/',
        moduleName: 'AppTemplate'
    },

    // settings for coverage plugin
    coverageReporter: {
        type: 'html',
        dir: 'coverage/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'Firefox'],

    client: {
        mocha: {
            timeout: '5000'
        }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
