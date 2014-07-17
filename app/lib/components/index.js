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
	get_component_template : function(component_path, data) {
        console.log(components.get_component_path(component_path));
        
        var component = require('../../../' + components.get_component_path(component_path));
        var component_rendered = component.get(data);

        return component_rendered;
	},
    get_component_template_partial : function() {

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

/**
 * Test Area -- Disregard
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

hbs.registerHelper('get_component', function(component, args) {
    var options,
        data;

    try {
        options = JSON.parse(args.hash.opts);
    } catch(e) {
        console.log(e);
    }

    try {
        data = JSON.parse(args.hash.data);
    } catch(e) {
        console.log(e);
    }

    // TODO - Options for deciding how the template is pulled
    return new hbs.SafeString(components.get_component_template(component, data));
});

var test = function() {
    var data = {
        name : 'John'
    }

    var template = 'Template Name: {{$ "name" name="test" obj=\'\
        {\
            "poop" : 3\
        }\
    \'}}';

    template = 'Component: {{get_component "search_bar" opts=\'\
        {\
            "just_template" : "true"\
        }\
    \'\
    data=\'\
        {\
            "input_label" : "a label",\
            "input_type" : "text",\
            "input_value" : "",\
            "input_placeholder" : "Search"\
        }\
    \'}}';

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

module.exports = components;
