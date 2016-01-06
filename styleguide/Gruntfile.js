module.exports = function(grunt) {


    var os = require('os');
    var ifaces = os.networkInterfaces();
    var lookupIpAddress = null;
    for (var dev in ifaces) {
        if (dev !== "en1" && dev !== "en0") {
            continue;
        }
        ifaces[dev].forEach(function(details) {
            if (details.family === 'IPv4') {
                lookupIpAddress = details.address;
            }
        });
    }

    //If an IP Address is passed
    //we're going to use the ip/host from the param
    //passed over the command line
    //over the ip addressed that was looked up
    var ipAddress = grunt.option('host') || lookupIpAddress;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Task configuration.
        shell: {
            wraith: { // Visual Regression Testing
                command: [
                    "cd tests/wraith",
                    "wraith capture config",
                    "../../"
                ].join('&&')
            },
            scssGlob: {
                command: [
                    "sass -r sass-globbing source/sass/styles.scss:source/css/style.css",
                    "cd ./"
                ].join('&&')
            }
        },
        clean: {
            options: {
                force: true
            },
            files: ['./public/patterns']
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/* \n * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n * \n * <%= pkg.author %>, and the web community.\n * Licensed under the <%= pkg.license %> license. \n * \n * Many thanks to Brad Frost and Dave Olsen for inspiration, encouragement, and advice. \n *\n */\n\n',
            },
            patternlab: {
                src: './builder/patternlab.js',
                dest: './builder/patternlab.js'
            },
            object_factory: {
                src: './builder/object_factory.js',
                dest: './builder/object_factory.js'
            }
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: './source/js/',
                        src: '*',
                        dest: './public/js/'
                    },
                    {
                        expand: true,
                        cwd: './source/css/',
                        src: 'style.css',
                        dest: './public/css/'
                    },
                    {
                        expand: true,
                        cwd: './source/images/',
                        src: ['*.png', '*.jpg', '*.gif', '*.jpeg'],
                        dest: './public/images/'
                    },
                    {
                        expand: true,
                        cwd: './source/images/sample/',
                        src: ['*.png', '*.jpg', '*.gif', '*.jpeg'],
                        dest: './public/images/sample/'
                    },
                    {
                        expand: true,
                        cwd: './source/fonts/',
                        src: '*',
                        dest: './public/fonts/'
                    },
                    {
                        expand: true,
                        cwd: './source/_data/',
                        src: 'annotations.js',
                        dest: './public/data/'
                    }
                ]
            }
        },

        /*
            CSS
        */

        sass: {
            dist: {
                options: { // Target options
                    sourcemap: true
                },
                files: {
                    'public/css/style.css': 'source/css/style.scss'
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'public/css/',
                src: ['style.css'],
                dest: 'public/css/',
                ext: '.min.css'
            }
        },
        uncss: { // Removes unused css
            dist: {
                options: {
                    stylesheets: ['/css/style.css'],
                    htmlroot: 'public'
                },
                files: {
                    'public/css/style.css': ['public/patterns/**/*.html']
                }
            }
        },
        /*
        Images
    */

        svgmin: { // Task
            options: { // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false
                    }, {
                    removeUselessStrokeAndFill: false
                    }, {
                    convertPathData: {
                        straightCurves: false // advanced SVGO plugin option
                    }
                }]
            },
            dist: { // Target
                files: [{ // Dictionary of files
                    expand: true, // Enable dynamic expansion.
                    cwd: 'source/images/', // Src matches are relative to this path.
                    src: ['**/*.svg'], // Actual pattern(s) to match.
                    dest: 'public/images/', // Destination path prefix.
                    ext: '.svg' // Dest filepaths will have this extension.
                    // ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
                }]
            }
        },

        "svg-sprites": {
            "svg-sprite": {
                options: {
                    spriteElementPath: "public/images/",
                    spritePath: "public/images/",
                    cssPath: "public/css/",
                    cssSuffix: "scss",
                    cssPrefix: "_",
                    sizes: {
                        std: 18
                    },
                    refSize: 17,
                    unit: 20
                }
            }
        },

        imagemin: { // Task
            dynamic: {
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: 'source/images', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match
                    dest: 'public/images' // Destination path prefix
                }]
            }
        },

        responsive_images: {
            myTask: {
                options: {
                    files: [{
                        expand: true,
                        src: ['source/images/**/*.{jpg,gif,png}'],
                        dest: 'source/images/responsive'
                    }]
                }
            }
        },

        /*
            Performance & Testing
        */
        'html-inspector': {
            all: {
                src: ['public/patterns/**/*.html', '!public/patterns/**/*escaped.html']
            }
        },

        csscss: {
            dist: {
                src: ['source/css/style.scss']
            }
        },

        cssmetrics: {
            dev: {
                src: [
                    'public/css/style.css'
                ]
            },
            prod: {
                src: [
                    'public/css/style.min.css'
                ]
            }
        },

        /*
            Server Related
        */

        watch: {
            html: {
                files: [
                    'source/_patterns/**/*.mustache',
                    'source/_patterns/**/*.hbs',
                    'source/_patterns/**/*.json',
                    'source/_data/*.json',
                ],
                tasks: ['patternlab', 'copy'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            styles: {
                files: ['source/sass/**/*.scss'],
                tasks: ['shell:scssGlob', 'copy'],
                options: {
                    spawn: false
                }
            },
            svgs: {
                files: ['source/images/**/*.svg'],
                tasks: ['shell:patternlab', 'svgmin', "svg-sprites"],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            imgs: {
                files: ['source/images/**/*.{png,jpg,gif}'],
                tasks: ['responsive_images', 'imagemin'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'public/*.html',
                    '{.tmp,public}/css/{,*/}*.css',
                    '{.tmp,public}/js/{,*/}*.js',
                    'public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }

        },

        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outsideres
                hostname: '0.0.0.0',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        'public'
                    ]
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        'public'
                    ]
                }
            },
            dist: {
                options: {
                    base: 'source'
                }
            }
        },

        browserSync: {
            bsFiles: {
                src: 'public/css/style.css'
            },
            options: {
                host: ipAddress,
                watchTask: true
            }
        },

        /*
            Misc
        */

        replace: {
            ip: {
                src: ['public/**/*.html'], // source files array (supports minimatch)
                overwrite: true, // destination directory or file
                replacements: [{
                    from: '0.0.0.0', // string replacement
                    to: ipAddress
                }]
            }
        },

        /*
            JS
         */
        jshint: {
            options: {
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "forin": true,
                //"unused": true,
                "node": true
            },
            patternlab: ['Gruntfile.js', './builder/lib/patternlab.js']
        },
        nodeunit: {
            all: ['test/*_tests.js']
        }
    });

    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('serve', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'sass',
            'replace',
            'connect:livereload',
            //'browserSync',
            'watch'
        ]);
    });

    //load the patternlab task
    grunt.task.loadTasks('./builder/');

    //if you choose to use scss, or any preprocessor, you can add it here
    grunt.registerTask('default', ['clean', 'concat', 'patternlab', 'shell:scssGlob', 'copy', 'uncss', 'cssmin', 'cssmetrics:prod']);
    grunt.registerTask('webapp', ['clean', 'concat', 'patternlab:web', 'shell:scssGlob', 'copy', 'uncss', 'cssmin', 'cssmetrics:prod']);

    grunt.registerTask('wraith', ['shell:wraith']);
    grunt.registerTask('test', ['csscss', 'cssmetrics:dev']);

    //travis CI task
    grunt.registerTask('travis', ['clean', 'concat', 'patternlab', /*'sass',*/ 'copy', 'nodeunit']);
};
