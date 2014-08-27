'use strict';

var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
    var lr = livereload();
	gulp.watch(['app/public/sass/**/*.scss', '!app/public/sass/styles.scss'], ['processSCSS']);
    gulp.watch('app/patterns/**/*.scss', ['processSCSS']);
    gulp.watch(['app/patterns/**/*.hbs', 'styleguide/source/images/**/*'], ['processPatterns', 'server']);
    gulp.watch(['./app.js', './app/**/*.js', './gulp/**/*.js'], ['server']);
    gulp.watch('styleguide/source/branding/**/*.hbs', ['brandingSite']);

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
