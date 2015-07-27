
'use strict';

var EventEmitter     = require( 'events' ).EventEmitter,
    util             = require( 'util' ),
    chalk            = require( 'chalk' ),
    seleniumLauncher = require( 'selenium-launcher' );

var Server = function Server  () {

    // cached instance members
    this.selenium = null;

    return this;
};

util.inherits( Server , EventEmitter );

Server.prototype.events = {
    'success': 'onCreateSeleniumServer',
    'fail':    'onErrorSeleniumServer'
};

Server.prototype.run = function run () {
    var server = this;

    // launch selenium
    seleniumLauncher( function( err , selenium ) {
        // console.log( '!!' , err , selenium , '??' );
        if( err ){
            // something went 'wut?'... exit.
            console.log( '??', err );
            // process.exit( 1 );
            server.emit( server.events.fail , null );
        }

        // Selenium is running. Notify user host/port
        console.log( chalk.green( 'SeleniumServer Started on ' + chalk.cyan( selenium.host ) + ':' + chalk.cyan( selenium.port ) ) );

        // cache reference to selenium for ease in killing later.
        server.selenium = selenium;

        // create the webdriver...
        // server.client.onCreateWebDriver( selenium );

        server.emit( server.events.success , selenium );
    });

    return server;
};

Server.prototype.destroy = function destroy () {
    // kill the wabbit!
    this.selenium.kill();
    return this;
};

exports = module.exports = Server;
