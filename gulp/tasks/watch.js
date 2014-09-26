'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('watch', ['setWatch'], function() {
    gulp.watch(['webapp/patterns/**/*.hbs', 'styleguide/source/images/**/*'], ['processPatterns', 'server']);
    gulp.watch('styleguide/source/branding/**/*.hbs', ['brandingSite']);
});

gulp.task('processPatterns', function() {
    runSequence('movePatterns', 'processStyleguide');
});
