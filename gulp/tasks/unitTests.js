
'use strict';

var path  = require( 'path' ),
    gulp  = require( 'gulp' ),
    gutil = require( 'gulp-util' ),
    karma = require( 'karma' ).server,
    configFile;

gulp.task( 'unitTests' , function ( done ) {
    configFile = path.join( process.cwd() , '/test/unit/karma.conf.js' );

    gutil.log(
        gutil.colors.yellow( '\n**********\n' ),
        gutil.colors.green( '* Begin Unit Testing' ),
        gutil.colors.yellow( '\n**********' )
    );

    karma.start({
        configFile: configFile,
        singleRun: true
    },
    function() {
        done();
    });
});
