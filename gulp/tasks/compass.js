'use strict';

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    cssGlobbing = require('gulp-css-globbing'),
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence'),
    path = require('path');

gulp.task('compass', function() {

        return gulp.src(['./public/css/styles.scss'])
        .pipe( compass({
            config_file : './compass.rb',
            css : './public/css/',
            sass : './public/css/',
            style : 'compressed'
        }) )
        .pipe(gulp.dest('./public/css/'));

});
