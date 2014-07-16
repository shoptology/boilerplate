'use strict';

var gulp = require('gulp'),
    path = require('path');

gulp.task('movePatterns', function() {

    return gulp.src(['./app/patterns/**/*.hbs'])
    .pipe(gulp.dest('./styleguide/source/test/'));

});
