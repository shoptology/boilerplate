'use strict';

var request = require('request');

module.exports = function (grunt) {
	// show elapsed time at the end
	require('time-grunt')(grunt);
	// load all grunt tasks
	require('load-grunt-tasks')(grunt);

	var reloadPort = 35729, files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		shell: {
			mongodb: {
				command: 'sudo mongod --dbpath ./data/db',
				options: {
					async: true
				}
			}
		},

		develop: {
			server: {
				file: 'app.js',
				env: {
					port: 3000
				}
			}
		},

		watch: {
			options: {
				nospawn: true,
				livereload: reloadPort
			},

			handlebars: {
				files: ['views/**/*.hbs'],
				tasks: ['develop', 'delayed-livereload']
			},

			js: {
				files: [
					'app.js',
					'controllers/**/*.js',
					'models/**/*.js',
					'config/*.js'
				],
				tasks: ['delayed-livereload']
			},

			node: {
				files: [
					'app.js',
					'controllers/**/*.js',
					'models/**/*.js',
					'config/*.js'
				],
				tasks: ['develop', 'delayed-livereload']
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.config.requires('watch.js.files');
	files = grunt.config('watch.js.files');
	files = grunt.file.expand(files);

	grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
		var done = this.async();
		setTimeout(function () {
			request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function(err, res) {
				var reloaded = !err && res.statusCode === 200;
				if(reloaded) {
					grunt.log.ok('Delayed live reload successful.');
				} else {
					grunt.log.error('Unable to make a delayed live reload.');
					done(reloaded);
				}
			});
		}, 500);
	});

	grunt.registerTask('default', ['shell:mongodb', 'develop', 'watch']);
};
