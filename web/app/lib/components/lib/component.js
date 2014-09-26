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

		if(fs.existsSync(base_path + options.files.template)) {
			template = fs.readFileSync(base_path + options.files.template);
		}
		if(fs.existsSync(base_path + options.files.styles)) {
			styles = fs.readFileSync(base_path + options.files.styles);
		}
		if(fs.existsSync(base_path + options.files.helpers)) {
			helpers = require(base_path + options.files.helpers);
		}
		if(options.template_engine == 'handlebars') {
			template_engine = 'handlebars';
			hbs = require('handlebars');
		}
	};

	this.get = function(data) {
        data.id = get_id();

		if(template_engine == 'html') {
			var template_rendered = template;
		} else {
            if(helpers) {
                helpers.register(hbs);
            }
			var template_compiled = hbs.compile(template.toString());
			var template_rendered = template_compiled(data);
		}

		return template_rendered;
	};

	this.get_styles = function() {
		if(styles) {
			return styles;
		}
	};

    var get_id = function() {
       return 'c-' + new Date().getTime() + Math.floor((Math.random() * (1000 - 1)) + 1);
    }

	construct();
};

module.exports = Component;
