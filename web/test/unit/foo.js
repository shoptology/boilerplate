
'use strict';

var Foo = require( '../../app/public/js/example-test-unit' ),
    fooUnit, spyA, spyB;

suite( 'Foo Unit Test', function () {

    suiteSetup( function ( done ){
        // construct the unit
        fooUnit = new Foo();

        done();
    });

    setup( function ( done ){
        // spy on methods
        spyA = sinon.spy( fooUnit , 'doSomethingA' );
        spyB = sinon.spy( fooUnit , 'doSomethingB' );

        done();
    });

    teardown( function ( done ){
        // restore spy wrappers
        fooUnit.doSomethingA.restore();
        fooUnit.doSomethingB.restore();

        // spyA = undefined;
        // spyB = undefined;

        done();
    });

    /*suiteTeardown( function ( done ){
        // define suiteTeardown logic
        done();
    });*/

    test( 'success', function ( done ) {
        assert.ok( true , 'true is true!' );
        done();
    });

    test( 'fail', function ( done ) {
        // Failing Test:
        assert.ok( false , 'false is true?' );
        // Test should be:
        // assert.notOk( false , 'false is not true.' );
        done();
    });

    test( 'spy test A', function ( done ) {
        // initialize the unit with data
        fooUnit.init({
            foo: 'foo'
        });

        assert.ok( spyA.called , 'spyA was called.' );
        assert.notOk( spyB.called , 'spyB was not called.' );
        done();
    });

    test( 'spy test B', function ( done ) {
        // initialize the unit without data
        fooUnit.init();

        assert.ok( spyB.called , 'spyB was called.' );
        assert.notOk( spyA.called , 'spyA was not called.' );
        done();
    });
});
