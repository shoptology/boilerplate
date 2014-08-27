var dependencies = require('./dependencies');

var Components = function() {
    var self = this;

    var controllers = {};
    var components = {};

    var init = function() {
        processDependencies();
        attachControllers()
    };

    var processDependencies = function() {
        for(var d in dependencies) {
            var dep = dependencies[d];

            controllers[d] = dep;
        }
    };

    var attachControllers = function() {
        for(var c in controllers) {
            var elements = document.querySelectorAll('.c-' + c);

            if(elements.length) {
                for(var e in elements) {
                    var element = elements[e];

                    if(typeof element == 'object') {
                        if(typeof components[c] == 'undefined') {
                            components[c] = [];
                        }

                        components[c].push(new controllers[c](element, {
                            id : element.id
                        }));
                    }
                }
            }
        }
    };

    init();
};

module.exports = Components;
