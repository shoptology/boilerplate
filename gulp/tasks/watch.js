var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
    var lr = livereload();
	gulp.watch(['app/public/sass/**/*.scss', '!app/public/sass/styles.scss'], ['processSCSS']);
    gulp.watch('app/patterns/**/*.scss', ['processSCSS']);
    gulp.watch('app/patterns/**/*.hbs', ['processPatterns', 'server']);
    gulp.watch(['./app.js', './app/**/*.js', './gulp/**/*.js'], ['server']);
    gulp.watch( [ './app/**/*.js' , './test/unit/**/*.js' , '!./test/unit/coverage/**/*.*' ] , [ 'unitTests' ] );

	/*gulp.watch('src/images/**', ['images']);
	gulp.watch('src/htdocs/**', ['copy']);*/
    gulp.watch('app/views/**').on('change',
        function(file) {
            lr.changed(file.path);
        }
    );
	// Note: The browserify task handles js recompiling with watchify
});

gulp.task('processPatterns', function() {
    runSequence('movePatterns', 'processStyleguide');
});
