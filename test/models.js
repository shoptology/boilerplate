
'use strict';

var assert   = require( 'chai' ).assert,
    sinon    = require( 'sinon' ),
    mongoose = require( 'mongoose' ),
    User     = require( '../app/models/User' );

suite( 'User Model', function () {

    // Local testing variables
    var user, saveStub;

    suiteSetup( function ( done ){


        user = new User({
            email:    'test@gmail.com',
            password: 'password'
        });

        saveStub = sinon.stub( user , 'save' );

        done();
    });

    setup( function ( done ){
        // reset the sinon stub
        saveStub.reset();

        done();
    });

    // teardown( function ( done ){
    //     done();
    // });

    // suiteTeardown( function ( done ){
    //     done();
    // });

    test( 'should create a new user', function ( done ) {

        // define success path
        saveStub.returns({
            'err': null,
            'user': {
                'foo': 'Foo'
            },
            'count': 1
        })

        user.save();

        assert.isTrue( saveStub.called , 'User.save called' );
        done();
    });

    test( 'should not create a user with the unique email', function ( done ) {
        var saveCall;

        // define fail path
        saveStub.returns({
            'err': {
                'code': 11000
            },
            'user': null,
            'count': 0
        })

        user.save();

        saveCall = saveStub.getCall( 0 );

        assert.isTrue( saveStub.called , 'User.save called' );
        assert.equal( saveCall.returnValue.err.code , 11000 , 'Returns error code.' );

        done();
    });

    test( 'should find user by email', function ( done ) {

    //     User.findOne({ email: 'test@gmail.com' }, function(err, user) {
    //   if (err) return done(err);
    //   user.email.should.equal('test@gmail.com');
    //   done();
    // });

        done();
    });

    test( 'should delete a user', function ( done ) {

    //     User.remove({ email: 'test@gmail.com' }, function(err) {
    //   if (err) return done(err);
    //   done();
    // });

        done();
    });
});
