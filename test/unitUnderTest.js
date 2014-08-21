
'use strict';

var sinon = require( 'sinon' ),
    assert = require( 'chai' ).assert;

suite( 'A testing suite showing Sinon examples', function () {

    // suiteSetup( function ( done ){
    //     done();
    // });

    // setup( function ( done ){
    //     done();
    // });

    // teardown( function ( done ){
    //     done();
    // });

    // suiteTeardown( function ( done ){
    //     done();
    // });

    test( 'foo', function ( done ) {
        assert.notEqual( 'foo' , 0 , 'foo doesn\'t equal 0.' );
        done();
    });
});
