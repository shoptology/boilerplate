// Sets up and returns and express instance
// Here's the typical usage:
// ```
// initExpress = require( 'init-express' );
// app = initExpress.app();
// server = initExpress.listen( app );
// ```

'use strict';

var express = require( 'express' ),
    bodyParser = require( 'body-parser' ),
    path = require( 'path' ),
    config = require( '@shoptology/config' ),
    apiErrorHandling = require( '@shoptology/express-error-handling' ),
    corsMiddleware = require( 'cors' ),
    bodyParserMiddleware = require( 'body-parser' ),
    app,
    bodyParser,
    cors,
    errorHandling,
    gracefulShutdown,
    isApiRequest,
    listen,
    trustProxy,
    useStatic,
    watchers,

    /**
     * Setup body parsing. Only have urlencoded so far.
     * Add more as needed.
     *
     * @param  object app Express instance
     * @return object app Express instance
     */
    bodyParser = function( app ) {
        // parse application/x-www-form-urlencoded
        app.use( bodyParserMiddleware.urlencoded( { extended: true } ) );

        // parse application/json
        app.use( bodyParserMiddleware.json( { type: [ 'application/json', 'application/*json' ] } ) );

        // If you need to support multipart/form-data for file uploads,
        // you should handle it inside your route and use
        // https://github.com/andrewrk/node-multiparty/.

        return app;
    };

/**
 * Open CORS config. Allows from any origin.
 *
 * @param  object app Express instance
 * @return object app Express instance
 */
cors = function( app ) {
    app.use( corsMiddleware( {
        origin: true,
        methods: 'GET,PUT,POST,DELETE,OPTIONS',
        allowedHeaders: 'Authorization,Content-Type,Accept,Origin,' +
        'User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,' +
        'X-Requested-With,If-Modified-Since,Content-Range,' +
        'Content-Disposition,Content-Description,Access-Control-Allow-Origin',
        credentials: true,
        maxAge: 1728000
    } ) );
    return app;
};

/**
 * Catch-all error handling
 * @param  {object} app Express instance
 * @return {object}
 */
errorHandling = function( app ) {
    app.use( function( err, req, res, next ) {
        var error;
        if ( !err ) {
            next();
        }
        if ( isApiRequest( req ) ) {
            apiErrorHandling( err, res );
            next( err );
            return;
        }

        error = err;
        if ( !error.code ) {
            error.code = 500;
        }
        if ( error.code >= 500 ) {
            log.error( err );
        }

        // In case an exception was thrown after a response was sent
        if ( !res.headerSent ) {
            res.status( error.code );
            if ( app.get( 'env' ) !== 'production' ) {
                res.render( 'error', {
                    message: err.message,
                    error: error
                } );
            } else {
                res.render( 'error', {
                    message: err.message,
                    error: {}
                } );
            }
        }
        next( err );
    } );
    return app;
};

/**
 * This function is called when you want the server to die gracefully
 * i.e. wait for existing connections
 */
gracefulShutdown = function gracefulShutdown( server, shutdownTimeout, cb ) {
    var shutdown;

    if ( shutdownTimeout === undefined ) {
        shutdownTimeout = 10000;
    }

    shutdown = function() {
        log.info( 'Received kill signal, shutting down gracefully.' );

        server.close( function() {
            log.info( 'Closed out remaining connections.' );
            if ( cb ) {
                cb();
            } else {
                process.exit( 0 );
            }
        } );

        setTimeout( function() {
            log.info(
                'Could not close connections within ' +
                shutdownTimeout + ' milliseconds. Forcefully shutting down.'
            );
            process.exit( 0 );
        }, shutdownTimeout );
    };

    process.on( 'message', function( message ) {
        if ( message === 'shutdown' ) {
            shutdown();
        }
    } );

    // listen for TERM signal .e.g. kill
    process.on ( 'SIGTERM', shutdown );

    // listen for INT signal e.g. Ctrl-C
    process.on ( 'SIGINT', shutdown );
};

isApiRequest = function isApiRequest( req ) {
    return req.xhr || /application\/json;/.test( req.get( 'accept' ) );
};

listen = function( app ) {
    return app.listen( app.get( 'port' ), function() {
        log.info( 'Express server listening on port %d in %s mode', app.get( 'port' ), app.get( 'env' ) );
        if ( process.send ) {
            process.send( 'online' );
        }
    } );
};

/**
 * Use when Express lives behind a trusted load-balancer
 * (this is standard for us as we deploy on EC2 with Elastic Load Balancers)
 *
 * @param  object app Express instance
 * @return object app Express instance
 */
trustProxy = function( app ) {
    app.enable( 'trust proxy' );
};

useStatic = function useStatic( app ) {
    app.use( express.static( config.get( 'express:paths:static' ) ) );
    return app;
};

/**
 * Don't use this in production. Sets up webpack watching and
 * compiling along with browser-sync for injecting changes and reloading.
 *
 * @param  {object} app      The express instance
 * @param  {object} bs       A browser-sync instance
 * @param  {object} compiler A webpack instance
 * @return {object}          Returns the express instance
 */
watchers = function( app, bs, compiler ) {
    var webpack, webpackConfig, port, watcher;
    port = parseInt( config.get( 'port' ), 10 );

    if ( !bs ) {
        bs = require( 'browser-sync' ).create();
        bs.init( {
            logSnippet: false,
            port: port + 1,
            reloadOnRestart: true,
            server: false,
            ui: {
                port: port + 2,
                weinre: {
                    port: port + 3
                }
            }
        } );
    }

    app.use( require( 'connect-browser-sync' )( bs ) );
    if ( !compiler ) {
        webpack = require( 'webpack' );
        webpackConfig = require( path.resolve( process.cwd(), './webpack.config.js' ) );
        compiler = webpack( webpackConfig );
    }
    watcher = require( 'webpack-browsersync-reload' )( compiler, bs );
    app.use( watcher.middleware );
};

app = function( app ) {
    if ( !app ) {
        app = express();
    }

    app.set( 'port', config.get( 'port' ) );
    app.set( 'views', config.get( 'express:paths:views' ) );
    app.set( 'view engine', config.get( 'express:viewEngine' ) );

    if ( app.get( 'env' ) === 'development' ) {
        watchers( app );
    }

    useStatic( app );
    trustProxy( app );
    cors( app );
    bodyParser( app );
    errorHandling( app );

    return app;
};

exports = module.exports = {
    app: app,
    bodyParser: bodyParser,
    cors: cors,
    errorHandling: errorHandling,
    gracefulShutdown: gracefulShutdown,
    isApiRequest: isApiRequest,
    listen: listen,
    trustProxy: trustProxy,
    useStatic: useStatic,
    watchers: watchers
};


