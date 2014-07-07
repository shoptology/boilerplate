var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('develop', function () {
  nodemon(
    {
        script: 'app.js',
        ext: 'html js hbs',
        env: {
            'NODE_ENV' : 'dev',
            'livereload' : true,
            'browsersync' : true
        }
    })
    .on('start', 'watch')
    .on('restart', function() {
        console.log('restarted!');
    })
})
