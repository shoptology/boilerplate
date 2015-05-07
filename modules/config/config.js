'use strict';

// always setup newrelic first so it can instrument everything
var newrelic;
if ( process.env.NEW_RELIC_HOME ) {
    newrelic = require( 'newrelic' );
}

var dotenv = require( 'dotenv' ),
    nconf = require( 'nconf' ),
    path = require( 'path' );

if ( process.env.NODE_ENV === 'production' ) {
    dotenv.config( { silent: true } );
} else {
    dotenv.load();
}

// Pretty sure the default colon is not allowed in an environment var name
// At least, if we put that in a .env file, it doesn't get loaded.
nconf.env('__');

nconf.defaults( {
    express: {
        cors: false,
        paths: {
            'static': path.resolve( process.cwd(), './public' ),
            'views': path.resolve( process.cwd(), './app/views' ),
        },
        trustProxy: true,
        viewEngine: 'hbs'
    },
    log: {
        file: null,
        level: 'info',
        name: 'log', // maybe there's a way to get the calling app's name from package.json
        stream: process.stdout
    },
    mongo: {
        uri: 'mongodb://localhost/test',
        log: false,
        options: {
            db: {
                safe: true
            },
            socketOptions: {
                keepAlive: 1
            }
        }
    },
    newrelic: newrelic ? true : false,
    paths: {
        'code': path.resolve( process.cwd(), './app' ),
        'public': path.resolve( process.cwd(), './public' ),
        'tests': path.resolve( process.cwd(), './test' ),
    },
    port: nconf.get( 'PORT' ) || 8080,
    // NodeMailer SMTP Transport settings
    smtp: {
        // host: 'smtp.mandrillapp.com',
        port: 587,
        // auth: {
        //     user: '',
        //     pass: ''
        // },
        // default is 5, trying a higher value
        'maxConnections': 15,
        'maxMessages': Infinity
    },
    versionPrefix: '/v1'
} );

exports = module.exports = nconf;
