'use strict';

/**
 * Handlebars helpers
 */
var hbs = require('hbs'),
    _ = require('lowdash');

var components = require('./components');

var Helpers = {
    register : function() {
        var functions = Helpers.functions;
        for(var f in functions) {
            hbs.registerHelper(f, functions[f]);
        }
        return true;
    },
    functions : {
        $ : function(partial) {
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

            return new hbs.SafeString(partial(context));
        },
        /**
         * Returns a component template
         *
         * Usage:
         * {{get_component 'component/name' opts='{"option" : "value"}' data='{"data" : "value"}'}}
         *  opts - Stringified JSON object of below options
         *      //TODO
         *
         *  data - Stringified JSON object of data to pass to template
         */
        get_component : function(component, args) {
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
        }
    }
};

module.exports = Helpers;
