var gulp = require('gulp'),
    sass = require('gulp-sass'),
    filter = require('gulp-filter'),
    browserSync = require('browser-sync');

gulp.task('sass', function () {
    gulp.src([
        './public/css/styles.scss'
    ])
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));// Write the CSS & Source maps
    //.pipe(filter('**/*.css')) // Filtering stream to only css files
    //.pipe(browserSync.reload({stream:true}));
});
