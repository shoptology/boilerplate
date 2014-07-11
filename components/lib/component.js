'use strict';

/**
 * Component Base Class
 */

var fs = require('fs');

var Component = function(options, base_path) {
	var template,
		styles,
		helpers,
		template_engine = 'html',
		hbs;

	var construct = function() {
		base_path = base_path + '/';
		// Going to change this to automatically include the files available.

		if(fs.existsSync(base_path + options.files.template)) {
			console.log("EXISTS!!!");
			template = fs.readFileSync(base_path + options.files.template);

			console.log(template);
		}
		/*
		if(options.files.styles) {
			styles = require(base_path + options.files.styles);
		}
		if(options.files.helpers) {
			helpers = require(base_path + options.files.helpers);
		}
		if(options.template_engine == 'handlebars') {
			hbs = require('handelbars');
		}*/
	};

	this.get = function(data) {
		if(template_engine == 'html') {
			var template_rendered = template;
		} else {
			var template_compiled = hbs.compile(template)
			var template_rendered = template_compiled(data);
		}

		return template_rendered;
	};

	this.get_template = function(data) {

	};

	this.get_styles = function() {
		if(styles) {
			return styles;
		}
	};

	this.get_controller = function() {

	};

	construct();
};

module.exports = Component;