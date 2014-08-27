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
 */

module.exports = {
    search_bar : require('03-components/00-search_bar')
};
},{"03-components/00-search_bar":1}],3:[function(require,module,exports){
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

},{"./dependencies":2}],4:[function(require,module,exports){
var Components = require('./lib/components');

$(document).ready(function() {
	Components = new Components();
});

},{"./lib/components":3}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbW1heS9Qcm9qZWN0cy9ib2lsZXJwbGF0ZS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL21tYXkvUHJvamVjdHMvYm9pbGVycGxhdGUvYXBwL3BhdHRlcm5zLzAzLWNvbXBvbmVudHMvMDAtc2VhcmNoX2Jhci9pbmRleC5qcyIsIi9Vc2Vycy9tbWF5L1Byb2plY3RzL2JvaWxlcnBsYXRlL2FwcC9wdWJsaWMvanMvbGliL2NvbXBvbmVudHMvZGVwZW5kZW5jaWVzLmpzIiwiL1VzZXJzL21tYXkvUHJvamVjdHMvYm9pbGVycGxhdGUvYXBwL3B1YmxpYy9qcy9saWIvY29tcG9uZW50cy9pbmRleC5qcyIsIi9Vc2Vycy9tbWF5L1Byb2plY3RzL2JvaWxlcnBsYXRlL2FwcC9wdWJsaWMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChfX2Rpcm5hbWUpe1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFNlYXJjaCBCYXIgQ29tcG9uZW50XG4gKi9cbmlmKHR5cGVvZiByZXF1aXJlTG9jYWwgIT09ICd1bmRlZmluZWQnKSB7XG5cdHZhciBDb21wb25lbnQgPSByZXF1aXJlTG9jYWwoJ2xpYi9jb21wb25lbnQnKTtcblxuXHR2YXIgb3B0aW9ucyA9IHtcblx0XHRmaWxlcyA6IHtcblx0XHRcdHRlbXBsYXRlIDogJ3NlYXJjaF9iYXIuaGJzJyxcblx0XHRcdHN0eWxlcyA6ICdzdHlsZXMuY3NzJyxcblx0XHRcdGhlbHBlcnMgOiAnaGVscGVycy5qcydcblx0XHR9LFxuXHRcdHRlbXBsYXRlX2VuZ2luZVx0OiAnaGFuZGxlYmFycydcblx0fVxuXG5cdHZhciBjb21wb25lbnQgPSBuZXcgQ29tcG9uZW50KG9wdGlvbnMsIF9fZGlybmFtZSk7XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQ7XG59IGVsc2Uge1xuXHR2YXIgQ29udHJvbGxlciA9IGZ1bmN0aW9uKGVsLCBvcHRzKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0dmFyIGluaXQgPSBmdW5jdGlvbigpIHtcblx0XHRcdGVsLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0YWxlcnQoJ0kgYW0gJyArIGVsLmlkKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0aW5pdCgpO1xuXHR9XG5cblx0bW9kdWxlLmV4cG9ydHMgPSBDb250cm9sbGVyO1xufVxufSkuY2FsbCh0aGlzLFwiLy4uLy4uL3BhdHRlcm5zLzAzLWNvbXBvbmVudHMvMDAtc2VhcmNoX2JhclwiKSIsIi8qKlxuICogTGlzdCBjb21wb25lbnQgcGF0aHMgYmVsb3dcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzZWFyY2hfYmFyIDogcmVxdWlyZSgnMDMtY29tcG9uZW50cy8wMC1zZWFyY2hfYmFyJylcbn07IiwidmFyIGRlcGVuZGVuY2llcyA9IHJlcXVpcmUoJy4vZGVwZW5kZW5jaWVzJyk7XG5cbnZhciBDb21wb25lbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGNvbnRyb2xsZXJzID0ge307XG4gICAgdmFyIGNvbXBvbmVudHMgPSB7fTtcblxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHByb2Nlc3NEZXBlbmRlbmNpZXMoKTtcbiAgICAgICAgYXR0YWNoQ29udHJvbGxlcnMoKVxuICAgIH07XG5cbiAgICB2YXIgcHJvY2Vzc0RlcGVuZGVuY2llcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IodmFyIGQgaW4gZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICB2YXIgZGVwID0gZGVwZW5kZW5jaWVzW2RdO1xuXG4gICAgICAgICAgICBjb250cm9sbGVyc1tkXSA9IGRlcDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgYXR0YWNoQ29udHJvbGxlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZm9yKHZhciBjIGluIGNvbnRyb2xsZXJzKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYy0nICsgYyk7XG5cbiAgICAgICAgICAgIGlmKGVsZW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGZvcih2YXIgZSBpbiBlbGVtZW50cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9IGVsZW1lbnRzW2VdO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBlbGVtZW50ID09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YgY29tcG9uZW50c1tjXSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudHNbY10gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50c1tjXS5wdXNoKG5ldyBjb250cm9sbGVyc1tjXShlbGVtZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQgOiBlbGVtZW50LmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgaW5pdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb21wb25lbnRzO1xuIiwidmFyIENvbXBvbmVudHMgPSByZXF1aXJlKCcuL2xpYi9jb21wb25lbnRzJyk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXHRDb21wb25lbnRzID0gbmV3IENvbXBvbmVudHMoKTtcbn0pO1xuIl19
