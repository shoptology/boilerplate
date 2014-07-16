var gulp = require('gulp'),
    prefix = require('gulp-autoprefixer')

gulp.task('prefix', function(){
    gulp.src(['./public/css/styles.css'])
    .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7'))
    .pipe(gulp.dest('./public/css/'));
});
