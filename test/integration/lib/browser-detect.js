/**
 * Detect which browsers the user has installed.
 *
 * Inspired heavily by: https://github.com/celer/element34
 */

'use strict';

var EventEmitter    = require( 'events' ).EventEmitter,
    util            = require( 'util' ),
    path            = require( 'path' ),
    fs              = require( 'fs' ),
    os              = require( 'os' ),
    spawn           = require( 'child_process' ).spawn,
    which           = require( 'which' ),
    Q               = require( 'Q' ),
    _browserData    = [
        {
            'paths': [
                '/usr/bin/google-chrome',
                '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
                '%HOMEPATH%i\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe',
                'C:\\Users\\%USERNAME%\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
            ],
            'label':       'Chrome',
            'slug':        'chrome',
            'isAvailable': false
        },
        {
            'paths': [
                '/Applications/Firefox.app/Contents/MacOS/firefox-bin',
                '%PROGRAMFILES%\\Mozilla Firefox\\firefox.exe'
            ],
            'label':       'Firefox',
            'slug':        'firefox',
            'isAvailable': false
        },
        {
            'label':       'Safari',
            'slug':        'safari',
            'isAvailable': false
        },
        {
            'label':       'PhantomJS',
            'slug':        'phantomjs',
            'isAvailable': false
        }
    ];

var BrowserDetect = function BrowserDetect () {

    var self = this;

    // cache browser data
    this.browsers = _browserData;

    // cache browser helper methods
    this.browserHelpers = [];

    var _getHelper = function _getHelper( methodName ) {
        console.log( methodName , this );
        return self[ methodName ];
    };

    // private method with helper internal private methods
    var _initialize = function _initialize () {
        var helpers = {
            '_checkAvailableChrome': function _checkAvailableChrome ( options ) {
                var opts       = options || {},
                    browserObj = opts.browserObj || {},
                    deffered   = Q.defer(),
                    paths      = browserObj.paths;

                for( var i in paths ) {
                    if( fs.existsSync( paths[ i ] ) ) {
                        deffered.resolve({
                            'data': browserObj,
                            'result': true
                        });
                    }
                }

                if( os.platform() === 'linux' ) {
                    which( 'google-chrome' , function( err , res ){
                        deffered.resolve({
                            'data': browserObj,
                            'result': res !== null
                        });
                    });
                }

                return deffered.promise;
            },
            '_checkAvailableFirefox': function _checkAvailableFirefox ( options ) {
                var opts       = options || {},
                    browserObj = opts.browserObj || {},
                    deffered   = Q.defer(),
                    paths      = browserObj.paths;

                if( os.platform() === 'linux' ) {
                    which( 'firefox' , function( err , res ){
                        deffered.resolve({
                            'data': browserObj,
                            'result': res !== null
                        });
                    });
                }
                else {
                    for( var i in paths ) {
                        if( fs.existsSync( paths[ i ] ) ) {
                            deffered.resolve({
                                'data': browserObj,
                                'result': true
                            });
                        }
                    }
                }

                return deffered.promise;
            },
            '_checkAvailableSafari': function _checkAvailableSafari ( options ) {
                var opts       = options || {},
                    browserObj = opts.browserObj || {},
                    deffered   = Q.defer();

                deffered.resolve({
                    'data': browserObj,
                    'result': os.platform() === 'darwin'
                });

                return deffered.promise;
            },
            '_checkAvailablePhantomJS': function _checkAvailablePhantomJS ( options ) {
                var opts       = options || {},
                    browserObj = opts.browserObj || {},
                    deffered    = Q.defer(),
                    phantomCall = spawn ( 'phantomjs' , [ '--version' ] );

                // grep for version on data of call to phantomJS
                phantomCall
                    .stdout.on( 'data' , function ( data ) {
                        var regEx = new RegExp( /(\d*).(\d*).(\d)(.*)/g );
                        deffered.resolve({
                            'data': browserObj,
                            'result': regEx.test( data )
                        });
                    });

                // handle error of phantomJS call / reject promise
                phantomCall
                    .stderr.on( 'data' , function ( data ) {
                        console.log( 'phantomCall stderr: ' + data );
                        deffered.resolve({
                            'data': browserObj,
                            'result': false
                        });
                    });

                // handle end of child processes / reject if errors
                phantomCall
                    .on( 'close' , function ( code ) {
                        if ( code !== 0 ) {
                            console.log( 'phantomCall process exited with code ' + code );
                            deffered.resolve({
                                'data': browserObj,
                                'result': false
                            });
                        }
                    });

                return deffered.promise;
            }
        };

        // check for browser availability
        Q.all( self.browserHelpers )
            .spread( function () {
                var args = arguments,
                    envelope, browser;

                for( var key in args ) {
                    envelope = args[ key ];

                    if( envelope.result ){
                        browser = self.getBrowserData( envelope.data.slug );
                        browser.isAvailable = envelope.result;
                    }
                }
            })
            .done( function () {
                self.emit( self.events.success , self.getBrowsers() );
            });

        self.browsers.forEach( function ( browser ) {
            var fnName = '_checkAvailable' + browser.label,
                data   = {
                    'browserObj': browser
                };

            self.browserHelpers
                .push( helpers[ fnName ]( data ) );

        } , self );
    };

    // initialize the promise queue
    _initialize();

    return this;
};

util.inherits( BrowserDetect , EventEmitter );

BrowserDetect.prototype.events = {
    'success': 'onBrowserDetectSuccess',
    'fail':    'onBrowserDetectFail'
};

BrowserDetect.prototype.getBrowserData = function getBrowserData ( slug ) {
    return this.browsers
        .map( function ( val , index , arr ) {
            if( val.slug === slug ) {
                return val;
            }
        })
        .filter( function ( val ) {
            return typeof val !== 'undefined';
        })
        [ 0 ];
};

BrowserDetect.prototype.getBrowsers = function getBrowsers () {
    return this.browsers
        .map( function ( val , index , arr ) {
            // console.log( index , val );
            if ( val.isAvailable) {
                return val;
            }
        })
        .filter( function ( val ) {
            return typeof val !== 'undefined';
        });
};

exports = module.exports = BrowserDetect;
