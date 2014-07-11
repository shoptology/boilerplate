'use strict';

/**
 * Search Bar Component
 */

var Component = requireLocal('lib/component');

var options = {
	files : {
		template : 'template.hbs',
		styles : 'styles.css',
		helpers : 'helpers.js'
	},
	template_engine	: 'handlebars'
}

var SearchBar = function() {
	// Some custom functionality
};

SearchBar.prototype = new Component(options, __dirname);

module.exports = SearchBar;