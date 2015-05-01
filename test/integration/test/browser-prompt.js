
'use strict';

var assert = require( 'chai' ).assert,
    sinon  = require( 'sinon' ),
    CLI    = require( '../lib/browser-prompt' ),
    prompt, emitterStub, runStub , browserString;

suite( 'Browser Selection Prompt ::', function () {

    suiteSetup( function ( done ){

        browserString = 'Foo';

        prompt = new CLI({
            'browsers': []
        });

        emitterStub = sinon.stub( prompt , 'emit' );
        runStub     = sinon.stub( prompt , 'run' );

        emitterStub.withArgs( prompt.events.success ).returns( true );
        emitterStub.withArgs( prompt.events.fail ).returns( false );

        runStub.withArgs( true ).returns( browserString );
        runStub.withArgs( false ).throws( new Error( 'Invalid browser selection.' ) );

        done();
    });

    // setup( function ( done ){done();});

    // teardown( function ( done ){done();});

    suiteTeardown( function ( done ){

        emitterStub.restore();
        runStub.restore();

        done();
    });


    test( 'Module has events exposed', function ( done ) {

        assert.isObject( prompt.events , 'events is publicly exposed' );

        done();
    });

    test( 'Module has public run() method exposed', function ( done ) {

        assert.isFunction( prompt.run , 'run method is publicly exposed' );

        done();
    });

    test( 'Retuns browser string on success', function ( done ) {

        assert.ok( emitterStub( prompt.events.success ) , 'success returns True');

        assert.equal( runStub( true ) , browserString , 'Browser string returned');

        done();
    });

    // test( 'Retuns Error on failure', function ( done ) {

    //     assert.notOk( emitterStub( prompt.events.fail ) , 'success returns False');

    //     assert.throw( runStub( false ) , 'Invalid browser selection' , 'Error Thrown');

    //     done();
    // });
});

// PUBLIC API:
//     events
//     run
