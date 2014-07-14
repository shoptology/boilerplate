var gulp = require('gulp'),
    compass = require('gulp-compass'),
    path = require('path');

gulp.task('compass', function() {
    gulp.src('./public/css/*.scss')
    .pipe(compass({
        config_file: './compass.rb',
        css: 'public/css',
        sass: 'public/css'
    }))
  .pipe(gulp.dest('./public/css'));
});
