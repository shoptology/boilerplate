'use strict';

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    path = require('path'),
    browserSync = require('browser-sync');

gulp.task('compass', function() {

        return gulp.src(['./app/public/sass/styles.scss'])
        .pipe( compass({
            config_file : './compass.rb',
            css : './app/public/css/',
            sass : './app/public/sass/',
            style : 'compact'
        }) )
        .pipe(gulp.dest('./app/public/css/'))
        .pipe(browserSync.reload({stream:true}));

});
