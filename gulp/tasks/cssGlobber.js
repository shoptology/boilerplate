'use strict';

var gulp = require('gulp'),
    cssGlobbing = require('gulp-css-globbing'),
    path = require('path');

gulp.task('globStyles', function() {

    // Glob style.css first to get all dependencies
    return gulp.src(['./public/sass/styles.scss'])
    .pipe(cssGlobbing({ extensions: ['.scss'] }))
    .pipe(gulp.dest('./public/css/'));

});
