
'use strict';

var EventEmitter  = require( 'events' ).EventEmitter,
    util          = require( 'util' ),
    extend        = require( 'util-extend' ),
    chalk         = require( 'chalk' ),
    Webdriver     = require( 'selenium-webdriver' ),
    configObj     = require( './config' ),
    BrowserSniff  = require( './browser-detect' ),
    BrowserPrompt = require( './browser-prompt' ),
    Server        = require( './server' ),
    TestRunner    = require( './runner' );

var IntegrationTestRunner = function IntegrationTestRunner () {

    // initialize public instance variables
    // ------------------------------------

    // instance config object.
    // will extend config module
    this.config = null;

    // instance of SeleniumServer wrapper
    this.server = null;

    // instance of WebDriver
    this.driver = null;

    // instance of the Test Runner
    this.runner = null;

    // store local configuration - copy object
    this.config = configObj;

    this.onDetectBrowsers();

    return this;
};

util.inherits( IntegrationTestRunner , EventEmitter );

IntegrationTestRunner.prototype.onDetectBrowsers = function onDetectBrowsers() {

    var browserDetect;

    // notify user of progress
    // README:
    //      using process.stdout over console, as prompt - the library
    //      in use of the CLI module, has issues positioning the cursor
    //      if console.log has been used as it uses process.stdout
    process.stdout.write( chalk.yellow.bold( 'Detecting installed browsers, please wait.' ) );

    // Detect installed browsers and listen for detection success/fail.
    browserDetect = new BrowserSniff();
    browserDetect
        .on( browserDetect.events.success , this.onPromptForBrowser.bind( this ) )
        .on( browserDetect.events.fail , this.onBrowserDetectError.bind( this ) );

    return this;
};

IntegrationTestRunner.prototype.onPromptForBrowser = function onPromptForBrowser( e ) {
    var prompt;
    // console.log( '!!!!' , e , '!' );

    if( !e ){
        process.stdout.write( '\n' );
        console.log( chalk.red.bold( '\nError: Array of Browsers Expected.\n' + chalk.gray( 'exiting.\n' ) ) );
        process.exit();
    }

    // prompt user for browser choice
    prompt = new BrowserPrompt({
        browsers: e
    });

    // listen for browser selection
    prompt
        .on( prompt.events.success , this.onStartSeleniumServer.bind( this ) )
        .on( prompt.events.fail , this.onBrowserSelectError.bind( this ) )
        .run();

    return this;
};

IntegrationTestRunner.prototype.onStartSeleniumServer = function onStartSeleniumServer( e ) {

    process.stdout.write( '\n' );

    if( !e ){
        console.log( chalk.red.bold( '\nError: String of Browser Expected.\n' + chalk.gray( 'exiting.\n' ) ) );
        process.exit();
    }

    this.config.browser = e;

    // spin up selenium server now that we have browser information.
    this.server = new Server();
    this.server
        .on( this.server.events.success , this.onCreateWebDriver.bind( this ) )
        .on( this.server.events.fail , this.onSeleniumServerError.bind( this ) )
        .run();

    return this;
};

IntegrationTestRunner.prototype.onCreateWebDriver = function onCreateWebDriver( e ) {

    var server , browser;

    if( !e ){
        process.stdout.write( '\n' );
        console.log( chalk.red.bold( '\nError: Selenium Object Expected.\n' + chalk.gray( 'exiting.\n' ) ) );
        process.exit();
    }

    server  = this.config.server = e;
    browser = this.config.browser;

    // create webdriver client and go!
    this.driver = new Webdriver.Builder()
        .usingServer( 'http://' + server.host + ':' + server.port + '/wd/hub' )
        .withCapabilities( Webdriver.Capabilities[ browser ]() )
        .build();

    this.config.driver = this.driver;

    // run dem test
    this.onCreateTestRunner();

    return this;
};

IntegrationTestRunner.prototype.onCreateTestRunner = function onCreateTestRunner() {

    this.runner = new TestRunner({
        'config': this.config,
        'driver': this.driver
    });

    this.runner
        .on( this.runner.events.completed , this.onTestsComplete.bind( this ) )
        .run();

    return this;
};

IntegrationTestRunner.prototype.onTestsComplete = function onTestsComplete( e ) {
    var self = this;

    this.driver
        .quit()
            .then( function () {
                console.log( chalk.gray( 'finished quitting client, shutting down server and exiting.' ) );
                self.server.destroy();
                // process.exit( e );
                process.exit( 0 );
            });
};

// Error Handlers:
// ----------------------------

IntegrationTestRunner.prototype.onBrowserDetectError = function onBrowserDetectError( e ) {
    process.stdout.write( '\n' );
    console.log( chalk.red.bold( '\nonBrowserDetectError: %s\n' + chalk.gray( 'exiting.\n' ) ) , e.message );
    process.exit();
};

IntegrationTestRunner.prototype.onBrowserSelectError = function onBrowserSelectError( e ) {
    process.stdout.write( '\n' );
    console.log( chalk.red.bold( '\nonBrowserSelectError: %s\n' + chalk.gray( 'exiting.\n' ) ) , e.message );
    process.exit();
};

IntegrationTestRunner.prototype.onSeleniumServerError = function onSeleniumServerError( e ) {
    process.stdout.write( '\n' );
    console.log( chalk.red.bold( '\nonSeleniumServerError: %s\n' + chalk.gray( 'exiting.\n' ) ) , e.message );
    process.exit();
};

exports = module.exports = new IntegrationTestRunner ();
