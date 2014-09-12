'use strict';

/* Enumerates all components for auto-bundling */

var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    components = require('../../app/lib/components');

gulp.task('enumerateComponents', function() {
    var component_list = components.get_component_list();
    var file;

    file = '/**\n';
    file += ' * Auto-generated dependency list\n';
    file += ' */\n';
    file += '\n';
    file += 'module.exports = {\n';

    for(var i = 0; i < component_list.length; i++) {
        var c = component_list[i];

        file += '\t' + c.component_name + ' : ' + '\'' + c.component_path + '\'';

        if(i < component_list.length - 2) {
            file += ',';
        }

        file += '\n';
    }

    file += '};';

    fs.writeFile('./app/public/js/lib/components/dependencies.js', file, function(err) {
        if(err) {
            console.log(err);
        }
    });
});
