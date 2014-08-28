'use strict';

/**
 * Manages components on the front-end
 */

// File that contains a series of require statements
// to load controllers for components into the front-end
var controllers = require('./dependencies');

var Components = function() {
    var self = this;

    var components = {};

    var init = function() {
        attachControllers()
    };

    // Loop through loaded contollers
    // Look for templates in the DOM expecting a controller
    // Attach a new instance of the controller to the DOM element
    // Store all component categories and instances in var components
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
