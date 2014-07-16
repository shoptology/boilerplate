var gulp = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
    var lr = livereload();
	gulp.watch('public/sass/**/*.scss', ['processSCSS']);
	/*gulp.watch('src/images/**', ['images']);
	gulp.watch('src/htdocs/**', ['copy']);*/
    gulp.watch('app/views/**').on('change',
        function(file) {
            lr.changed(file.path);
        }
    );
	// Note: The browserify task handles js recompiling with watchify
});


gulp.task('processSCSS', function() {
    runSequence('globStyles', 'compass', 'removeSCSSFromCSS');
});
