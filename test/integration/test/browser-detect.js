
'use strict';

var assert       = require( 'chai' ).assert,
    sinon        = require( 'sinon' ),
    BrowserSniff = require( '../lib/browser-detect' ),
    sniffer, emitterStub, success, failure;

suite( 'Browser Detection ::', function () {

    suiteSetup( function ( done ){
        sniffer     = new BrowserSniff();
        emitterStub = sinon.stub( sniffer , 'emit' );
        // success     = sinon.spy();
        // failure     = sinon.spy();

        emitterStub.withArgs( sniffer.events.success ).returns( [] );
        emitterStub.withArgs( sniffer.events.fail ).returns( false );

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ){
        emitterStub.restore();

        done();
    });

    test( 'Module has events exposed', function ( done ) {

        assert.isObject( sniffer.events , 'events is publicly exposed' );

        done();
    });

    test( 'Module has public methods to retrieve browser list', function ( done ) {

        assert.isFunction( sniffer.getBrowserData , 'getBrowserData is publicly exposed' );

        done();
    });

    test( 'Module has public methods to retrieve selected browser data', function ( done ) {

        assert.isFunction( sniffer.getBrowsers , 'getBrowsers is publicly exposed' );

        done();
    });

    test( 'Retuns browsers array on success', function ( done ) {


        assert.isArray( emitterStub( sniffer.events.success ) , 'success returns array');

        done();
    });

    // test( 'Returns error on fail', function ( done ) {
    //     // write tests
    //     done();
    // });
});


// public api:
//     events
//     getBrowserData
//     getBrowsers
