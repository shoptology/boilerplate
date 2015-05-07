/* global requireLocal */
/* global -log */
'use strict';

var path = require( 'path' ),
    config = require( 'config' ),
    paths = config.get( 'paths' ),
    log  = require( 'log' );

Error.stackTraceLimit = 100;

exports.globals = {
    log: log,
    requireLocal: function requireLocal( name ) {
        if ( name.indexOf( 'test') === 0 ) {
            return require( path.resolve( paths.tests, name ) );
        }
        return require( path.resolve( paths.code, name ) );
    }
};

exports.register = function ( globalNamespace ) {
    for ( var name in exports.globals ) {
        if ( !exports.globals.hasOwnProperty( name ) ) {
            continue;
        }
        globalNamespace[ name ] = exports.globals[ name ];
    }
};
