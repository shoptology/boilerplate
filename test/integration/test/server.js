
'use strict';

var assert = require( 'chai' ).assert,
    sinon  = require( 'sinon' ),
    Server = require( '../lib/server' ),
    server, emitterStub;


suite( 'Selenium Server ::', function () {

    suiteSetup( function ( done ){
        server = new Server();
        emitterStub = sinon.stub( server , 'emit' );

        emitterStub.withArgs( server.events.success ).returns( true );
        emitterStub.withArgs( server.events.fail ).returns( false );

        done();
    });

    suiteTeardown( function ( done ){
        emitterStub.restore();

        done();
    });

    test( 'Application Name', function ( done ) {

        done();
    });

    test( 'Module has events exposed', function ( done ) {

        assert.isObject( server.events , 'events is publicly exposed' );

        done();
    });

    test( 'Module has public run() method exposed', function ( done ) {

        assert.isFunction( server.run , 'run method is publicly exposed' );

        done();
    });

    test( 'Module has public destroy() method exposed', function ( done ) {

        assert.isFunction( server.destroy , 'destroy method is publicly exposed' );

        done();
    });

    test( 'Server returns server on success', function ( done ) {
        assert.ok( emitterStub( server.events.success ) , 'success returns true' );
        done();
    });

    test( 'Server returns error on failure', function ( done ) {
        assert.notOk( emitterStub( server.events.fails ) , 'fail returns false' );
        done();
    });
});

// Public API:
//     events
//     run
//     destroy
