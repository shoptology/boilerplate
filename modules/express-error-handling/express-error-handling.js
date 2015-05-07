/**
 * API Error Handling
 *
 * @todo  update package.json
 * "dependencies": {
 *   "api-envelope": "shoptology/api-envelope#v1.0.0"
 * }
 *
 */

'use strict';

var Envelope = require( '@shoptology/api-envelope' );

/**
 * Standard way to handle exceptions in routes.
 *
 * @param  {Error} error
 * @param  {object} response
 * @param  {string} message  Error message detail to return
 * @param  {object} envelope Optional response envelope
 */
exports = module.exports = function handleException( error, response, message, envelope ) {
    if ( !message ) {
        message =  'The server encountered an unexpected error.';
    }
    if ( !envelope ) {
        envelope = new Envelope();
    }

    if ( error.code && error.code < 500 ) {
        if ( error.code === 400 && error.errors ) {
            envelope.error(
                400,
                {
                    details: error.errors.map( function( error ) {
                        return error.message;
                    } )
                }
            );
        } else {
            envelope.error( error.code, {
                details: error.message
            } );
        }
    } else {
        log.error( error );
        envelope.error( 500, {
            details: message
        } );
    }
    // In case an exception was thrown after a response was sent
    if ( !response.headerSent ) {
        response.json( envelope );
    }
};

