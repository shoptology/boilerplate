'use strict';

/**
 * Requires files relative to module root
 */

var dir = __dirname.substr(0, __dirname.lastIndexOf('lib'));

module.exports = GLOBAL.requireLocal = function(module) {
	return require(dir + module);
};
