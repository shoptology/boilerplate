'use strict';

/**
 * Component API Controller
 */

require('./lib/requireLocal');

var hbs = require('Handlebars');
var _ = require('lodash');

var components = {
	get_component : function(component_path, data) {
		var component = require('../../patterns/components/' + component_path);
		var component_rendered = component.get(data);

		return component_rendered;
	},
	get_component_template : function() {

	},
    get_component_template_partial : function() {

    }
};

/*
hbs.registerHelper('$', function(partial) {
    var values, opts, done, value, context;

    if (!partial) {
        console.error('No partial name given.');
    }

    values = Array.prototype.slice.call(arguments,1);
    opts = values.pop();

    while(!done) {
        value = values.pop();
        if(value) {
            partial = partial.replace(/:[^\.]+/, value);
        } else {
            done = true;
        }
    }

    // If partial is not compiled, compile it
    if(typeof hbs.partials[partial] === 'string') {
        partial = hbs.compile(hbs.partials[partial]);
    } else {
        partial = hbs.partials[partial];
    }

    if(!partial) {
        console.warn('Partial not found');
        return '';
    }

    context = _.extend({}, opts.context||this, _.omit(opts, 'context', 'fn', 'inverse'));

    // Parse any JSON objects in hash
    // and promote properties in hash to context
    for(var h in context.hash) {
        var hash = context.hash;

        try {
            hash[h] = JSON.parse(hash[h]);
        } catch(e) {
            console.log(e);
        }

        if(typeof hash[h] === 'object') {
            for(var p in hash[h]) {
                context[p] = hash[h][p];
            }
        } else {
            context[h] = hash[h];
        }
    }

    console.log('Context: ', context);

    return new hbs.SafeString(partial(context));
});

var test = function() {
    var data = {
        name : 'John'
    }

    var template = 'Template Name: {{$ "name" name="test" obj=\'{"poop":3}\'}}';

    var partial = "{{hash.name}} {{hash.obj.poop}}";

    hbs.registerPartial('name', partial);

    template = hbs.compile(template);

    console.log(template(data));

    return false;
};

console.log(test());*/

/*
console.log(components.get_component('search_bar', {
	input_label : 'Search Bar',
	input_type : 'text',
	input_value : 'Search for something',
	input_placeholder : 'Search for something'
}));*/

module.export = components;
