(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__dirname){
'use strict';

/**
 * Search Bar Component
 */
if(typeof requireLocal !== 'undefined') {
	var Component = requireLocal('lib/component');

	var options = {
		files : {
			template : 'search_bar.hbs',
			styles : 'styles.css',
			helpers : 'helpers.js'
		},
		template_engine	: 'handlebars'
	}

	var component = new Component(options, __dirname);

	module.exports = component;
} else {
	var Controller = function(el, opts) {
		var self = this;

		var init = function() {
			el.onclick = function() {
				alert('I am ' + el.id);
			}
		};

		init();
	}

	module.exports = Controller;
}
}).call(this,"/../../patterns/03-components/00-search_bar")
},{}],2:[function(require,module,exports){
'use strict';

var Components = require('./lib/components');

$(document).ready(function() {
	// Component Controller
	// Initialization registers all components in the DOM
	// to their controllers
	Components = new Components();
});

},{"./lib/components":4}],3:[function(require,module,exports){
/**
 * List component paths below
 *
 * -Properties should be named the same as the class name of the component
 *  For example:
 *  'c-search_bar' should be 'search_bar'
 *
 * -Paths for the require statement are relative to '/app/patterns/'
 *  The first segment should always point to the components folder
 *  The second segment should point to the specific component's folder
 *
 *
 * Soon, this should be automatically generated
 *
 */

module.exports = {
    search_bar : require('03-components/00-search_bar')
};
},{"03-components/00-search_bar":1}],4:[function(require,module,exports){
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

},{"./dependencies":3}]},{},[2])