'use strict';

/**
 * Handlebars Helpers
 */
var hbs = require('hbs');

var Helpers = {
	register : function(handlebars) {
		if(!handlebars) handlebars = hbs;

		var functions = Helpers.functions;
		for(var f in functions) {
			handlebars.registerHelper(f, functions[f]);
		}
		return true;
	},
	functions : {
		gettime : function() {
			return new Date().getTime();
		}
	}
};

module.exports = Helpers;