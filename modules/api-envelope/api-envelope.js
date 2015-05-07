/**
 * API Envelope
 *
 * Provides a configurable object to return a standarized
 * API response format following emerging standards and best practices.
 *
 * Foursquare is one of the sites that follows these best practices,
 * so we can use them as our main point of reference.
 *
 * @link https://developer.foursquare.com/overview/responses
 * @example
 * {
 *     "meta": {
 *         "code": 200,
 *         ...errorType and errorDetail...
 *     },
 *     "notifications": {
 *         ...notifications...
 *     },
 *     "response": {
 *         ...results...
 *     }
 * }
 */


'use strict';

/**
 * Creates a new Envelope
 * @constructor
 */
var Envelope = function Envelope () {

    this.reset();

    // this.meta          = Object.create( Object.prototype );
    // this.response      = Object.create( Object.prototype );
    // this.notifications = Object.create( Object.prototype );

    return this;
};

/**
 * Meta Getter/Setter
 *
 * define getter/setter accessors for the Meta Object of the
 * Envelope prototype using Object.defineProperty.
 *
 * get:
 *     @returns {Object} Returns    Meta Object
 *
 * set:
 *     @param   {Object} meta       Sets the Meta Object
 *     @returns {Object} Returns    Meta Object
 */
Object.defineProperty( Envelope , 'meta' , {
    get: function () {
        return this.meta;
    },
    set: function ( metadata ) {
        this.meta = metadata || Object.create( Object.prototype );
    }
});

/**
 * Response Getter/Setter
 *
 * define getter/setter accessors for the Response Object of the
 * Envelope prototype using Object.defineProperty.
 *
 * get:
 *     @returns {Object} returns    Response Object
 *
 * set:
 *     @param   {Object} response   Sets the Response Object
 *     @returns {Object} Returns    Response Object
 */
Object.defineProperty( Envelope , 'response' , {
    get: function () {
        return this.response;
    },
    set: function ( response ) {
        // console.log( 'resp?: %s' , response );
        this.response = response || Object.create( Object.prototype );
    }
});

/**
 * Notifications Getter/Setter
 *
 * define getter/setter accessors for the Notifications Object of the
 * Envelope prototype using Object.defineProperty.
 *
 * get:
 *     @returns {Object} Returns    Notifications Object
 *
 * set:
 *     @param   {Object} response   Sets the Notifications Object
 *     @returns {Object} Returns    Notifications Object
 */
Object.defineProperty( Envelope , 'notifications' , {
    get: function () {
        return this.notifications;
    },
    set: function ( notifications ) {
        this.notifications = notifications || Object.create( Object.prototype );
    }
});

/**
 * Reset Envelope to default state.
 *
 * Resets/initializes Envelope to a default state of general error.
 * @return {Envelope} Envelope in default error state
 * @example
 * {
 *     meta: {
 *         code: 400,
 *         errorType: 'error_type',
 *         errorDetail: 'details of error'
 *     }
 * }
 */
Envelope.prototype.reset = function reset () {
    var data = this.statusCodes[ '400' ];

    this.meta = {
        'code': data.code,
        'errorType': data.errorType,
        'errorDetail': []
        // 'errorDetail': data.details
    };

    return this;
};

/**
 * Creates an Error Envelope
 *
 * creates an error envelope using supplied code and options,
 * defaulting to a 400 if no code supplied.
 *
 * Error Envelopes do not return a Response object.
 *
 * If code and options are supplied:
 * meta.code will be the code supplied
 * meta.errorType will be the supplied options.errorType,
 * falling back to default if not supplied.
 * meta.details will be the supplied optinos.details,
 * falling back to default if not supplied.
 *
 * If only a code is supplied:
 * meta.code will be the code supplied
 * meta.errorType and meta.details are the defaults of that code
 *
 * If only options is supplied:
 * meta.code will default to 400 if options.code is not supplied.
 * meta.errorType will be the supplied options.errorType,
 * falling back to default if not supplied.
 * meta.details will be the supplied optinos.details,
 * falling back to default if not supplied.
 *
 * @param  {String|Number}  code    status code [optional]
 * @param  {Object}         options object of error options [optional]
 * @return {Envelope}   Error Envelope
 */
Envelope.prototype.error = function error ( code , options ) {
    var opts, append, type, detail, tmpCode;

    if( arguments.length < 2 ) {
        // only one argument supplied
        if(
            ( typeof code === 'number' ) ||
            ( typeof code === 'string' )
        ){
            // options missing, use defaults
            tmpCode = ( typeof code === 'string' ) ? parseInt( code , 10 ) : code;

            code    = tmpCode;
            type    = this.statusCodes[ tmpCode ].errorType || '';
            detail  = [];
            // detail  = this.statusCodes[ tmpCode ].details || '';

        }
        else {
            // code was missing, see if its in options object
            opts   = code || {};
            append = opts.append;

            code   = opts.code || 400;
            type   = opts.type || this.statusCodes[ code ].errorType;
            detail = opts.details || [];
            // detail = opts.details || this.statusCodes[ code ].details;
        }
    }
    else {
        opts   = options || {};
        append = opts.append;
        // code   = opts.code || 400;
        type   = opts.type || this.statusCodes[ code ].errorType;
        detail = opts.details || [];
        // detail = opts.details || this.statusCodes[ code ].details;
    }

    // remove success data
    delete this.response;

    if( !append ){
        append = false;

        if( code && code !== this.meta.code ){
            append = false;
            this.meta.errorDetail = [];
        }

        if(
            ( type ) &&
            (
                ( !this.meta.errorType ) ||
                ( this.meta.errorType !== type )
            )
        ){
            append = false;
            this.meta.errorType = '';
        }
    }

    if( code ) {
        this.meta.code = code;
    }

    if( this.meta.code === 200 ) {
        this.meta.code = 400;
        append = false;
    }

    if( type ) {
        this.meta.errorType = type;
    }
    // else{}

    // if( !this.meta.errorType ) {
    //     this.meta.errorType = type || 'param_error';
    // }

    // if ( !Array.isArray( detail ) ) {
    //     // comma seperated list? i dunno.
    //     detail = detail.split( ',' );
    // }

    if( !append ) {
        if ( Array.isArray( detail ) ) {
            this.meta.errorDetail = detail;
        }
        else
        {
            this.meta.errorDetail.push( detail );
        }
    }
    else{

        if( Array.isArray( this.meta.errorDetail ) ) {
            if( Array.isArray( detail ) ) {
                detail.forEach( function ( errDetail ) {
                    this.meta.errorDetail.push( errDetail );
                } , this );
            }
            else {
                this.meta.errorDetail.push( detail );
            }
            // console.log( 'wtf"=:' , this.meta.errorDetail );
        }
        else {
            if( Array.isArray( detail ) ) {
                this.meta.errorDetail = [ this.meta.errorDetail ];
                detail.forEach( function ( errDetail ) {
                    this.meta.errorDetail.push( errDetail );
                } , this );
            }
            else {
                this.meta.errorDetail = [ this.meta.errorDetail , detail ];
            }
        }
    }

    return this;
};

/**
 * Creates a Success Envelope
 *
 * creates a success envelope using supplied code and data,
 * defaulting to a 200 if no code supplied.
 *
 * Success Envelopes do not return meta.errorType or meta.errorDetail
 *
 * If code and data are supplied:
 * meta.code will be the code supplied
 * response will be supplied data

 *
 * If only a code is supplied:
 * meta.code will be the code supplied
 * response will be undefined
 *
 * If only data is supplied:
 * meta.code will default to 200
 * response will supplied data
 *
 * @param  {String|Number}  code    status code [optional]
 * @param  {Object}         data    success data [optional]
 * @return {Envelope}               [description]
 */
Envelope.prototype.success = function success( code , data ) {

    // remove error meta data
    delete this.meta.errorType;
    delete this.meta.errorDetail;

    // remove success data
    delete this.response;

    if( arguments.length < 2 ) {
        // only one argument supplied
        if(
            ( typeof code === 'number' ) ||
            ( typeof code === 'string' )
        ){
            // data was missing.
            this.meta.code = ( typeof code === 'string' ) ? parseInt( code , 10 ) : code;
        }
        else {
            // code was missing, assume 200
            this.meta.code = 200;
            this.response  = code;
        }
        return this;
    }

    // set success data
    this.meta.code = code;
    this.response  = data;

    return this;
};



/**
 * Status Codes
 *
 * A collection of default status codes and their respective
 * default errorType and details.
 *
 * @type {Object}
 */
Envelope.prototype.statusCodes = {
    '200': {
        'code': 200,
        'errorType': 'success',
        'details': ''
    },
    '400': {
        'code': 400,
        'errorType': 'param_error',
        'details': 'A required parameter was missing or a parameter was malformed.'
    },
    '401': {
        'code': 401,
        'errorType': 'invalid_auth',
        'details': 'OAuth token was not provided or was invalid.'
    },
    '403': {
        'code': 403,
        'errorType': 'not_authorized',
        'details': 'User is not authorized to take this action.'
    },
    '404': {
        'code': 404,
        'errorType': 'endpoint_error',
        'details': 'The requested path does not exist.'
    },
    '405': {
        'code': 405,
        'errorType': 'not_allowed',
        'details': 'Attempting to use POST with a GET-only endpoint, or vice-versa.'
    },
    '409': {
        'code': 409,
        'errorType': 'conflict',
        'details': 'The request could not be completed as it is.'
    },
    '500': {
        'code': 500,
        'errorType': 'internal_error',
        'details': 'The server is experiencing melancholy.'
    }
};

/**
 * export Envelope
 */
exports = module.exports = Envelope;
