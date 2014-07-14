'use strict';

/**
 * Handlebars helpers
 */
var hbs = require('hbs');

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
        get_component : function() {

        }
    }
};

module.exports = Helpers;
