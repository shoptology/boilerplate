
'use strict';

var EventEmitter = require( 'events' ).EventEmitter,
    util         = require( 'util' ),
    fs           = require( 'fs' ),
    path         = require( 'path' ),
    Mocha        = require( 'mocha' ),
    chalk        = require( 'chalk' );

var Runner = function Runner ( options ) {

    var opts = options || {};

    this.config      = opts.config;
    this.driver      = opts.driver;
    this.mocha       = new Mocha( this.config.mocha );

    return this;
};

util.inherits( Runner , EventEmitter );

Runner.prototype.events = {
    'completed': 'onRunnerComplete'
};

Runner.prototype.run = function() {
    var runner  = this,
        driver  = runner.driver,
        config  = runner.config,
        modules = [],
        TestModule;

    driver
        .get( config.URL.init )
        .then( function () {
            fs.readdirSync( path.join( __dirname , 'tests' ) )
                .sort( function(a, b) {
                    return a < b ? -1 : 1;
                })
                .forEach( function(file) {
                    // only include js files
                    if(
                        ( file !== path.basename( __filename ) ) &&
                        ( path.extname( file ) === '.js' )
                    ){
                        runner.mocha.addFile(
                            path.join( __dirname , 'tests' , file )
                        );
                    }
                });

            runner.mocha.run( function ( failures ) {
                var failString = ( failures < 1 ) ? chalk.green( failures.toString() ) : chalk.red( failures.toString() );
                console.log( chalk.yellow( 'failed tests: %s' ) , failString );
                runner.emit( runner.events.completed , failures );
            });

            // modules
            //     .forEach( function( module ) {
            //         module.run();
            //     });
        });

};

exports = module.exports = Runner;
