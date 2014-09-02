
'use strict';

var expect    = require( 'chai' ).expect,
    should    = require( 'chai' ).should(),
    sinon     = require( 'sinon' ),
    Webdriver = require( 'selenium-webdriver' ),
    flow      = Webdriver.promise.controlFlow(),
    driver    = require( '../config' ).driver,
    URLs      = require( '../config' ).URL,
    flowExecutions = {
        'nav': function nav () {
            var dfd = Webdriver.promise.defer();

            driver.findElement(
                Webdriver.By
                    .css( 'body > div.navbar.navbar-default.navbar-fixed-top' )
            )
            .then( function ( present ) {
                if( present ){
                    dfd.fulfill( true );
                }
                else{
                    dfd.reject( false );
                }
            });

            return dfd.promise;
        },
        'content': function content () {
            var dfd = Webdriver.promise.defer();

            driver.findElement(
                Webdriver.By
                    .css( 'body > div.container' )
            )
            .then( function ( present ) {
                if( present ){
                    dfd.fulfill( true );
                }
                else{
                    dfd.reject( false );
                }
            });

            return dfd.promise;
        },/*
        'contentData': function contentData () {
            var dfd = Webdriver.promise.defer();

            driver.findElement(
                Webdriver.By
                    .css( 'div.container > h1' )
            )
            .then( function ( el ) {
                console.log( el , '??' );
            });

            return dfd.promise;
        },*/
        'footer': function footer () {
            var dfd = Webdriver.promise.defer();

            driver.findElement(
                Webdriver.By
                    .css( 'body > footer' )
            )
            .then( function ( present ) {
                if( present ){
                    dfd.fulfill( true );
                }
                else{
                    dfd.reject( false );
                }
            });

            return dfd.promise;
        }
    };

describe( 'Homepage tests', function () {

    before( function ( done ){
        driver
            .get( URLs.home )
                .then( function() {
                    done();
                });
    });

    // beforeEach( function ( done ){done();});

    // afterEach( function ( done ){done();});

    // after( function ( done ){done();});

    it( 'should have a navbar' , function ( done ) {

        flow.execute( flowExecutions.nav )
            .then(
                function ( present ) {
                    expect( present ).to.be.true;
                    done();
                },
                function( err ) {
                    console.log( 'There was an error! ' + err );
                    expect( err ).to.be.null;
                    done();
                }
            );
    });

    it( 'should have a main container' , function ( done ) {
        flow.execute( flowExecutions.content )
            .then(
                function ( present ) {
                    expect( present ).to.be.true;
                    done();
                },
                function( err ) {
                    console.log( 'There was an error! ' + err );
                    expect( err ).to.be.null;
                    done();
                }
            );

        /*flow.execute( flowExecutions.contentData )
            .then(
                function ( el ) {
                    expect( present ).to.be.true;
                    done();
                },
                function( err ) {
                    console.log( 'There was an error! ' + err );
                    expect( err ).to.be.null;
                    done();
                }
            );*/
    });

    it( 'should have a footer' , function ( done ) {
        flow.execute( flowExecutions.footer )
            .then(
                function ( present ) {
                    expect( present ).to.be.true;
                    done();
                },
                function( err ) {
                    console.log( 'There was an error! ' + err );
                    expect( err ).to.be.null;
                    done();
                }
            );
    });
});
