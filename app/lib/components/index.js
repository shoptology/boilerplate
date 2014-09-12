'use strict';

/**
 * Component API Controller
 */
require('./lib/requireLocal');

var hbs = require('hbs'),
    fs = require('fs');

var components = {
	get_component : function(component_path, data) {
		var component = require('../../patterns/components/' + component_path);
		var component_rendered = component.get(data);

		return component_rendered;
	},
	get_component_controller : function(component_path) {
		var component = require('../../../' + components.get_component_path(component_path));

		return component;
	},
	get_component_template : function(component_path, data) {
		var component = require('../../../' + components.get_component_path(component_path));
		var component_rendered = component.get(data);

		return component_rendered;
	},
    get_component_template_partial : function() {

    },
    get_component_list : function() {
        var path = components.find_matching_folder('app/patterns/', 'components');
        var components_folder = path.split('/');
        var components_folder_segment = components_folder[components_folder.length - 2];
        var dir = fs.readdirSync(path);
        var component_folders = [];


        for(var f in dir) {
            var fileSync = path + dir[f];
            var stat = fs.statSync(fileSync);

            if(stat.isDirectory()) {
                component_folders.push({
                    component_name : dir[f].match(/[^-]+$/)[0],
                    component_path : components_folder_segment + '/' + dir[f]
                });
            }
        }

        return component_folders;
    },
    get_component_path : function(component_path) {
        var components_folder = components.find_matching_folder('app/patterns/', 'components');
        var component_folder = '';

        component_path = component_path.split('/');

        for(var i = 0; i < component_path.length; i++) {
            component_folder += components.find_matching_folder(components_folder, component_path[i], true);
        }

        return components_folder + component_folder;
    },
    find_matching_folder : function(path, search, return_segment_only) {
        if(path !== '' && search !== '') {
            var dir = fs.readdirSync(path);

            for(var f in dir) {
                var fileSync = path + dir[f];
                var stat = fs.statSync(fileSync);

                if(stat.isDirectory() && dir[f].indexOf(search) !== -1) {
                    if(return_segment_only) {
                        return dir[f] + '/';
                    } else {
                        return path + dir[f] + '/';
                    }
                }
            }
        }

        return '';
    }
};

module.exports = components;
