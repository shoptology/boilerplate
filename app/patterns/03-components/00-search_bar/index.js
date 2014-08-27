'use strict';

/**
 * Search Bar Component
 */
if(typeof requireLocal !== 'undefined') {
	var Component = requireLocal('lib/component');

	var options = {
		files : {
			template : 'search_bar.hbs',
			styles : 'styles.css',
			helpers : 'helpers.js'
		},
		template_engine	: 'handlebars'
	}

	var component = new Component(options, __dirname);

	module.exports = component;
} else {
	var Controller = function(el, opts) {
		var self = this;

		var init = function() {
			el.onclick = function() {
				alert('I am ' + el.id);
			}
		};

		init();
	}

	module.exports = Controller;
}