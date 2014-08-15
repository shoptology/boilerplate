var gulp = require('gulp'),
    spawn = require('child_process').spawn,
    node;

gulp.task('develop', function () {
    gulp.run('server');
    gulp.run('watch');
});

gulp.task('server', function() {
    if (node) {
        node.kill();
    }

    node = spawn('node', ['app.js'], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

process.on('exit', function() {
    if (node) {
        node.kill();
    }
});
