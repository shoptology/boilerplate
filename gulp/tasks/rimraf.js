'use strict';

var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    path = require('path');

gulp.task('removeSCSSFromCSS', function() {

    return gulp.src('./public/css/styles.scss', { read: false })
    .pipe(rimraf());

});
