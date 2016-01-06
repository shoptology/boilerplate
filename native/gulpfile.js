var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var moment = require('moment');
var inject = require('gulp-inject');
var ngInject = require("gulp-ng-inject");


var paths = {
    sass: ['./scss/**/*.scss'],
    scripts: ['./www/js/**/*.js']
};

gulp.task('default', ['sass', 'js', 'watch']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task("ng-inject", function() {

    var options = {
        name: "ng-inject", // The name of the module to use in your main Angular.js
        modules: [] // Any extra modules that you want to include.
    };

    return gulp.src(["./www/js/**/*.module.js"])
        .pipe(ngInject("ng-inject.js", options)) // Name of the file generated
        .pipe(gulp.dest("./www/js/")) // Destination folder
});

gulp.task('js', ['ng-inject'], function () {
    return gulp.src('./www/index.html')
    .pipe(inject(gulp.src(['./www/js/common/**/*.js', './www/js/modules/**/*.js'], {base: './www', read: true}), {relative: true}))
    .pipe(gulp.dest('./www'));
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.scripts, ['js']);
});


gulp.task('uglify-js', function() {
    gulp.src(['www/js/**/*.js'])
        .pipe(concat('app'))
        .pipe(ngAnnotate())
        .on('error', notify.onError("Error: <%= error.message %>"))
        //.pipe(uglify())
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(rename({
            extname: ".min.js"
        }))
        .pipe(gulp.dest('www/js'))
        .pipe(notify('Uglified JavaScript (' + moment().format('MMM Do h:mm:ss A') + ')'))
    /*.pipe(liveReload({
        auto: false
    }));*/ ;
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
