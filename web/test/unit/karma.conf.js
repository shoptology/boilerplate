// Karma configuration
// Generated on Tue Aug 26 2014 15:35:38 GMT-0400 (EDT)

module.exports = function( config ) {

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'mocha',
            'chai-sinon',
            'browserify'
        ],

        // plugins: [],

        // list of files / patterns to load in the browser
        files: [ '**/*.js' ],

        // list of files to exclude
        exclude: [ 'coverage/**/*.*' ],

        client: {
            mocha: {
                ui: 'tdd',
                // ui: 'bdd',
                globals: [
                    'suite',
                    'test',
                    'suiteSetup',
                    'setup',
                    'teardown',
                    'suiteTeardown',
                    'describe',
                    'it',
                    'before',
                    'after',
                    'beforeEach',
                    'afterEach'
                ],
                timeout: 5000
            }
        },

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '**/*.js': [ 'jshint' , 'browserify' ],
            '../../app/**/*.js': [ 'jshint' , 'coverage' ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [ 'mocha' , 'growl' , 'coverage' ],
        // reporters: [ 'progress' ],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        // logLevel: config.LOG_DEBUG,
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'PhantomJS' ],
        // browsers: [ 'Chrome' , 'Firefox' , 'Safari' , 'PhantomJS' ],
        // browsers: [ 'Chrome' , 'Firefox' , 'Safari' , 'PhantomJS' , 'IE' ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Browserify config (all optional)
        browserify: {
            extensions: [ '.js' , '.hbs' ],
            debug: true,
            // watch: true
        },

        coverageReporter: {
            type: 'html',
            dir:  'coverage/'
        }
    });
};
