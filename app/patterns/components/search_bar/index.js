'use strict';

/**
 * Search Bar Component
 */

var Component = requireLocal('lib/component');

var options = {
	files : {
		template : 'search_bar.hbs',
		styles : 'styles.css',
		helpers : 'helpers.js'
	},
	template_engine	: 'handlebars'
}

var SearchBar = function() {
	// some custom functionality
}

SearchBar.prototype = new Component(options, __dirname);

module.exports = new SearchBar();
