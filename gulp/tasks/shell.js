var gulp  = require('gulp');
var shell = require('gulp-shell');

gulp.task('processStyleguide', shell.task('cd styleguide && grunt'));
