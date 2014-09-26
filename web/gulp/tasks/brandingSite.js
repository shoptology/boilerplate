var gulp = require('gulp'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars');

gulp.task('brandingSite', function () {
    var templateData = {},
    options = {
        batch : ['./styleguide/source/branding/partials'],
        ignorePartials : true
    }

    return gulp.src('./styleguide/source/branding/*.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest('./styleguide/public/branding'));
});
