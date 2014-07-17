'use strict';

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    path = require('path'),
    browserSync = require('browser-sync');

gulp.task('compass', function() {

        return gulp.src(['./public/css/styles.scss'])
        .pipe( compass({
            config_file : './compass.rb',
            css : './public/css/',
            sass : './public/css/',
            style : 'compact'
        }) )
        .pipe(gulp.dest('./public/css/'))
        .pipe(browserSync.reload({stream:true}));

});
