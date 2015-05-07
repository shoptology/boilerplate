// Inspired by https://github.com/webpack/webpack-dev-middleware/blob/master/middleware.js
// but uses browser-sync to notify changes to connected clients.
//
// @todo Should we use memory-fs? IMHO, writing to disk is better and more flixible if a little slower

'use strict';

var defaultOptions,
    reload;

defaultOptions = function defaultOptions( options ) {
    if ( !options ) {
        options = {};
    }
    if ( options.watchDelay === undefined ) {
        options.watchDelay = 200;
    }
    if ( options.stats === undefined ) {
        options.stats = {};
    }
    if ( options.stats.colors === undefined ) {
        options.stats.colors = true;
    }
    if ( options.stats.context === undefined ) {
        options.stats.context = process.cwd();
    }
    if ( options.quiet === undefined ) {
        options.quiet = false;
    }
    return options;
};

// Uses webpack compilation stats and compares it againsts
// cached filesizes to determine whether or not to live reload.
// We are using the extract plugin to separate out css into a
// separate file. This gives us the ability to inject
// css changes without a full page reload
// if none of the js actually changed.
reload = function reload( stats, cache, bs ) {
    var assetsStats = stats.toJson( {
        hash: true,
        timings: true,
        assets: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        caches: false,
        reasons: false,
        source: false,
        errorDetails: false,
        chunkOrigins: false
    } );
    assetsStats.assets.forEach( function( asset ) {
        var url, isNew, hasChanged;
        isNew = false;
        hasChanged = false;
        url = asset.name;
        if ( !cache[ url ] ) {
            isNew = true;
            cache[ url ] = asset.size;
            // until we have the connect middleware, don't
            // reload for new assets as it will cause a second
            // reload after the server starts up
            return;
        }
        if ( cache[ url ] !== asset.size ) {
            hasChanged = true;
        }
        cache[ url ] = asset.size;
        if ( asset.emitted && ( hasChanged || isNew ) ) {
            bs.reload( url );
        }
    } );
};

exports = module.exports = function( compiler, bs, options ) {
    var state = false,
        reloadCache = {},
        callbacks = [],
        watching;

    options = defaultOptions( options );

    watching = compiler.watch( options.watchDelay, function( err, stats ) {
        if ( err ) {
            throw err;
        }
    } );

    compiler.plugin( 'done', function( stats ) {
        // We are now on valid state
        state = true;

        // Do the stuff in nextTick, because bundle may be invalidated
        //  if a change happend while compiling
        process.nextTick( function() {
            var url, reloadInfo, cbs;

            // check if still in valid state
            if ( !state ) {
                return;
            }
            if ( !options.quiet && options.stats ) {
                console.log( stats.toString( options.stats ) );
            }
            if ( !options.quiet ) {
                console.info( 'webpack: bundle is now VALID.' );
            }

            reload( stats, reloadCache, bs );

            cbs = callbacks;
            callbacks = [];
            cbs.forEach( function continueBecauseBundleAvailible( cb ) {
                cb();
            } );
        } );
    } );

    // on compiling
    function invalidPlugin() {
        if ( state && !options.quiet ) {
            console.info( 'webpack: bundle is now INVALID.' );
        }
        // We are now in invalid state
        state = false;
    }
    compiler.plugin( 'invalid', invalidPlugin );
    compiler.plugin( 'compile', invalidPlugin );

    // wait for bundle valid
    function ready(fn, req) {
        if ( state ) {
            return fn();
        }
        if( !options.quiet ) {
            console.log( "webpack: wait until bundle finished: " + req.url );
        }
        callbacks.push(fn);
    }

    return {
        close: function( callback ) {
            callback = callback || function() {};
            if ( watching ) {
                watching.close( callback );
            } else {
                callback();
            }
        },
        compiler: compiler,
        invalidate: function invalidate() {
            if ( watching ) {
                watching.invalidate();
            }
        },
        middleware: function middleware( req, res, next ) {
            ready( next, req );
        },
        rebuild: function rebuild() {
            if ( state ) {
                state = false;
                compiler.run( function( err, stats ) {
                    if ( err ) {
                        throw err;
                    }
                } );
            }
        }
    };
};
