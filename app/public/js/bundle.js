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
},{"03-components/00-search_bar":1}],3:[function(require,module,exports){
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

},{"./dependencies":2}],4:[function(require,module,exports){
'use strict';

var Components = require('./lib/components');

$(document).ready(function() {
	// Component Controller
	// Initialization registers all components in the DOM
	// to their controllers
	Components = new Components();
});

},{"./lib/components":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbW1heS9Qcm9qZWN0cy9ib2lsZXJwbGF0ZS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21tYXkvUHJvamVjdHMvYm9pbGVycGxhdGUvYXBwL3BhdHRlcm5zLzAzLWNvbXBvbmVudHMvMDAtc2VhcmNoX2Jhci9pbmRleC5qcyIsIi9Vc2Vycy9tbWF5L1Byb2plY3RzL2JvaWxlcnBsYXRlL2FwcC9wdWJsaWMvanMvbGliL2NvbXBvbmVudHMvZGVwZW5kZW5jaWVzLmpzIiwiL1VzZXJzL21tYXkvUHJvamVjdHMvYm9pbGVycGxhdGUvYXBwL3B1YmxpYy9qcy9saWIvY29tcG9uZW50cy9pbmRleC5qcyIsIi9Vc2Vycy9tbWF5L1Byb2plY3RzL2JvaWxlcnBsYXRlL2FwcC9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNlYXJjaCBCYXIgQ29tcG9uZW50XG4gKi9cbmlmKHR5cGVvZiByZXF1aXJlTG9jYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdHZhciBDb21wb25lbnQgPSByZXF1aXJlTG9jYWwoJ2xpYi9jb21wb25lbnQnKTtcblxuXHR2YXIgb3B0aW9ucyA9IHtcblx0XHRmaWxlcyA6IHtcblx0XHRcdHRlbXBsYXRlIDogJ3NlYXJjaF9iYXIuaGJzJyxcblx0XHRcdHN0eWxlcyA6ICdzdHlsZXMuY3NzJyxcblx0XHRcdGhlbHBlcnMgOiAnaGVscGVycy5qcydcblx0XHR9LFxuXHRcdHRlbXBsYXRlX2VuZ2luZVx0OiAnaGFuZGxlYmFycydcblx0fVxuXG5cdHZhciBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG9wdGlvbnMsIF9fZGlybmFtZSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQ7XG59IGVsc2Uge1xuXHR2YXIgQ29udHJvbGxlciA9IGZ1bmN0aW9uKGVsLCBvcHRzKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGVsLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0YWxlcnQoJ0kgYW0gJyArIGVsLmlkKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aW5pdCgpO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xufVxufSkuY2FsbCh0aGlzLFwiLy4uLy4uL3BhdHRlcm5zLzAzLWNvbXBvbmVudHMvMDAtc2VhcmNoX2JhclwiKSIsIi8qKlxuICogTGlzdCBjb21wb25lbnQgcGF0aHMgYmVsb3dcbiAqXG4gKiAtUHJvcGVydGllcyBzaG91bGQgYmUgbmFtZWQgdGhlIHNhbWUgYXMgdGhlIGNsYXNzIG5hbWUgb2YgdGhlIGNvbXBvbmVudFxuICogIEZvciBleGFtcGxlOlxuICogICdjLXNlYXJjaF9iYXInIHNob3VsZCBiZSAnc2VhcmNoX2JhcidcbiAqXG4gKiAtUGF0aHMgZm9yIHRoZSByZXF1aXJlIHN0YXRlbWVudCBhcmUgcmVsYXRpdmUgdG8gJy9hcHAvcGF0dGVybnMvJ1xuICogIFRoZSBmaXJzdCBzZWdtZW50IHNob3VsZCBhbHdheXMgcG9pbnQgdG8gdGhlIGNvbXBvbmVudHMgZm9sZGVyXG4gKiAgVGhlIHNlY29uZCBzZWdtZW50IHNob3VsZCBwb2ludCB0byB0aGUgc3BlY2lmaWMgY29tcG9uZW50J3MgZm9sZGVyXG4gKlxuICpcbiAqIFNvb24sIHRoaXMgc2hvdWxkIGJlIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNlYXJjaF9iYXIgOiByZXF1aXJlKCcwMy1jb21wb25lbnRzLzAwLXNlYXJjaF9iYXInKVxufTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogTWFuYWdlcyBjb21wb25lbnRzIG9uIHRoZSBmcm9udC1lbmRcbiAqL1xuXG4vLyBGaWxlIHRoYXQgY29udGFpbnMgYSBzZXJpZXMgb2YgcmVxdWlyZSBzdGF0ZW1lbnRzXG4vLyB0byBsb2FkIGNvbnRyb2xsZXJzIGZvciBjb21wb25lbnRzIGludG8gdGhlIGZyb250LWVuZFxudmFyIGNvbnRyb2xsZXJzID0gcmVxdWlyZSgnLi9kZXBlbmRlbmNpZXMnKTtcblxudmFyIENvbXBvbmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgY29tcG9uZW50cyA9IHt9O1xuXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYXR0YWNoQ29udHJvbGxlcnMoKVxuICAgIH07XG5cbiAgICAvLyBMb29wIHRocm91Z2ggbG9hZGVkIGNvbnRvbGxlcnNcbiAgICAvLyBMb29rIGZvciB0ZW1wbGF0ZXMgaW4gdGhlIERPTSBleHBlY3RpbmcgYSBjb250cm9sbGVyXG4gICAgLy8gQXR0YWNoIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBjb250cm9sbGVyIHRvIHRoZSBET00gZWxlbWVudFxuICAgIC8vIFN0b3JlIGFsbCBjb21wb25lbnQgY2F0ZWdvcmllcyBhbmQgaW5zdGFuY2VzIGluIHZhciBjb21wb25lbnRzXG4gICAgdmFyIGF0dGFjaENvbnRyb2xsZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGZvcih2YXIgYyBpbiBjb250cm9sbGVycykge1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmMtJyArIGMpO1xuXG4gICAgICAgICAgICBpZihlbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBmb3IodmFyIGUgaW4gZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBlbGVtZW50c1tlXTtcblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgZWxlbWVudCA9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGNvbXBvbmVudHNbY10gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRzW2NdID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHNbY10ucHVzaChuZXcgY29udHJvbGxlcnNbY10oZWxlbWVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkIDogZWxlbWVudC5pZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGluaXQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50cztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2xpYi9jb21wb25lbnRzJyk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHQvLyBDb21wb25lbnQgQ29udHJvbGxlclxuXHQvLyBJbml0aWFsaXphdGlvbiByZWdpc3RlcnMgYWxsIGNvbXBvbmVudHMgaW4gdGhlIERPTVxuXHQvLyB0byB0aGVpciBjb250cm9sbGVyc1xuXHRDb21wb25lbnRzID0gbmV3IENvbXBvbmVudHMoKTtcbn0pO1xuIl19
