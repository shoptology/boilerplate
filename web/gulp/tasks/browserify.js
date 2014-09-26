'use strict';

/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var path         = require('path');
var gulp         = require('gulp');
var rename       = require('gulp-rename');
var browserify   = require('gulp-browserify');
var uglify       = require('gulp-uglify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');

gulp.task('browserify', function() {
    gulp.src(['./app/public/js/main.js'])
        .pipe(browserify({
            paths : [path.join(process.cwd(), 'node_modules'), path.join(process.cwd(), './app/patterns'), path.join(process.cwd(), './app/lib')],
            extensions : ['.js']
        }))
        .pipe(uglify())
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./app/public/js'));
});
