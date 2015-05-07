// We're depending on our config module to give
// the configuration we need for this.

'use strict';

var config = require( 'config' ).get( 'log' ),
    bunyan = require( 'bunyan' ),
    logSettings = {},
    logger,
    newrelic,
    originalErrorHandler;

logSettings = {
    level: config.level
};
if ( config.file ) {
    logSettings.path = config.file;
} else {
    logSettings.stream = config.stream || process.stdout;
}

logger = bunyan.createLogger({
    name: config.name || 'log',
    streams: [ logSettings ]
});

// Monkey patch to add in newrelic reporting
originalErrorHandler = logger.error;
logger.error = function( error, customParameters ) {
    if ( config.newrelic ) {
        newrelic.noticeError( error, customParameters );
    }
    originalErrorHandler.apply( this, arguments );
};

exports = module.exports = logger;
