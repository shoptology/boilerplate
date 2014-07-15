'use strict';

var gulp = require('gulp'),
    compass = require('gulp-compass'),
    path = require('path');

gulp.task('compass', function() {
    gulp.src([
        './public/css/*.scss',
        './app/patterns/**/*.scss'
    ])
    .pipe(compass({
        config_file : './compass.rb',
        css : './public/css/compasstest',
        sass : './public/css/compasstest'
    }))
    .pipe(gulp.dest('app/assets/temp'));
});
