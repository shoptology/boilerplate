var gulp        = require('gulp');
var sass        = require('gulp-ruby-sass');
var filter      = require('gulp-filter');
var browserSync = require('browser-sync');

gulp.task('sass', function () {
    return gulp.src([
        './public/**/*.scss',
        './app/patterns/**/*.scss'
        ])
        .pipe(sass({sourcemap: true}))
        .pipe(gulp.dest('./public'))// Write the CSS & Source maps
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.reload({stream:true}));
});
