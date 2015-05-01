
'use strict';

var assert = require( 'chai' ).assert,
    config = require( '../lib/config' ),
    appName, urls, mochaOpts,
    server, browser, driver;


suite( 'Config ::', function () {

    suiteSetup( function ( done ){
        appName   = config.appName;
        urls      = config.URL;
        mochaOpts = config.mocha;
        server    = config.server;
        browser   = config.browser;
        driver    = config.driver;

        done();
    });

    test( 'Application Name', function ( done ) {

        assert.isString( appName , 'Application name is a string' );
        assert.ok( appName , 'Application name is not empty' );

        done();
    });

    test( 'Application URLs', function ( done ) {

        assert.isObject( urls , 'URLs are an Object' );

        done();
    });

    test( 'Mocha Options', function ( done ) {

        // is an object
        assert.isObject( mochaOpts , 'Mocha Options are an Object' );

        // ui
        assert.isString( mochaOpts.ui , 'Mocha timeout is a number' );
        assert.equal( mochaOpts.ui , 'bdd' , 'Mocha UI set to BDD' );

        // timeout
        assert.isNumber( mochaOpts.timeout , 'Mocha timeout is a number' );

        // reporter eis optional.

        done();
    });

    test( 'Application Server', function ( done ) {

        assert.isNull( server , 'Application Server is null on initialization.' );

        done();
    });

    test( 'Application Browser', function ( done ) {

        assert.isNull( browser , 'Application Browser is null on initialization.' );

        done();
    });

    test( 'Application Webdriver', function ( done ) {

        assert.isNull( driver , 'Application Driver is null on initialization.' );

        done();
    });
});
