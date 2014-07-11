'use strict';

/**
 * Component API Controller
 */

require('./lib/requireLocal');

var components = {
	get_component : function(component_path, data) {
		var component = require('./components/' + component_path);
		
		var component_rendered = component.get(data);
	},
	get_component_template : function() {

	}
};

console.log(components.get_component('search_bar', {
	input_label : 'Search Bar',
	input_type : 'text',
	input_value : 'Search for something',
	input_placeholder : 'Search for something'
}));

module.export = components;