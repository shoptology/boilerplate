
'use strict';

var EventEmitter = require( 'events' ).EventEmitter,
    util         = require( 'util' ),
    prompt       = require( 'prompt' ),
    chalk        = require( 'chalk' );

var BrowserPrompt = function BrowserPrompt ( options ) {

    var opts     = options || {},
        browsers = opts.browsers || {};

    // store browsers passed in
    this.browsers = browsers.map( function ( val ) {
        return val.slug;
    });

    // reset prompt message & delimter
    prompt.message   = '';
    prompt.delimiter = chalk.gray( ' > ' );

    return this;
};

util.inherits( BrowserPrompt , EventEmitter );

BrowserPrompt.prototype.events = {
    'success': 'onBrowserSelectSuccess',
    'fail':    'onBrowserSelectFail'
};

BrowserPrompt.prototype.run = function run () {
    var self     = this,
        errCount = 0,
        schema   = {
            'name':        'browser',
            'type':        'string',
            'description': chalk.green( 'Please select a browser to run tests' ),
            'default':     'chrome',//'phantomjs',
            'message':     chalk.magenta( 'Must select an Installed browser or phantomjs' ),
            'conform': function( val ) {

                if( self.browsers.indexOf( val ) > -1 ) {
                    return true;
                }
                else{
                    errCount++;

                    if( errCount < 3 ){
                        return false;
                    }
                    else{
                        throw new Error( 'Invalid browser selection.' );
                    }
                }

            }
        };

    // Notify user of browsers available.
    process.stdout.write( '\n' );
    console.log( chalk.cyan( 'Installed browsers are:\n  ' + chalk.yellow( self.browsers.join( ', ' ) ) ) );

    // start prompt and get user's choice
    prompt.start();
    prompt.get( schema , function ( err , result ) {
        // log newline for prompt cursor position wonkiness.
        process.stdout.write( '\n' );
        // handle error
        if( err ) {
            // throw new Error( err );
            self.emit( self.events.fail , err );
            // console.log( 'FAIL!!!!' );
        }
        else {
            // notify user of choice
            // console.log( chalk.yellow( '\nStarting tests using %s.' ) , result.browser );

            self.emit( self.events.success , result.browser );
        }
    });

    return self;
};

exports = module.exports = BrowserPrompt;
