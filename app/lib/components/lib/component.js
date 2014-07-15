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

		// Going to change this to automatically include the files available
		// instead of requiring an explicit file list
		if(fs.existsSync(base_path + options.files.template)) {
			console.log("EXISTS!!!");
			template = fs.readFileSync(base_path + options.files.template);
		}
		if(fs.existsSync(base_path + options.files.styles)) {
			console.log("EXISTS!!!");
			styles = fs.readFileSync(base_path + options.files.styles);
		}
		/*
		if(fs.existsSync(base_path + options.files.helpers)) {
			console.log("EXISTS!!!");
			helpers = fs.readFileSync(base_path + options.files.helpers);
		}*/
		if(options.template_engine == 'handlebars') {
			template_engine = 'handlebars';
			hbs = require('handlebars');
		}
	};

	this.get = function(data) {
		if(template_engine == 'html') {
			var template_rendered = template;
		} else {
			var template_compiled = hbs.compile(template.toString());
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
