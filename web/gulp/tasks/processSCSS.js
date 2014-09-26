'use strict';

var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    path = require('path');


gulp.task('processSCSS', function() {
    return runSequence('backupStylesSCSS', 'globStyles', 'compass', 'prefix', 'restoreStylesSCSS', 'removeTempStylesSCSS');
});

// Backs up our stylesheet since our other scripts alter its source
gulp.task('backupStylesSCSS', function() {

    return gulp.src('./app/public/sass/styles.scss')
    .pipe(gulp.dest('./app/public/'));

});

// Restores the original scss file to the sass dir
gulp.task('restoreStylesSCSS', function() {

    gulp.src('./app/public/sass/styles.scss', { read: false })
    .pipe(rimraf());

    return gulp.src('./app/public/styles.scss')
    .pipe(gulp.dest('./app/public/sass/'));

});

gulp.task('removeTempStylesSCSS', function() {

    gulp.src('./app/public/styles.scss', { read: false })
    .pipe(rimraf());

});

