/**
 * This is an example of a module that is required from a unit test.
 * <p>
 * This example demonstrates the ability to require an individual
 * module from the browserify bundle for testing, as opposed to the entire
 * browserify bundle.
 * </p>
 * Tests are located under the test directory ("/test").
 *
 * @see Testing Guidelines in the README.md
 */

'use strict';

/**
 * Constructor Function
 * <p>
 * A fake module for requiring an individual module for unit testing
 * </p>
 */
var Foo = function Foo () {
    console.log( 'foo' );
    return this;
};

/**
 * Initializes the fake module
 * @param  {Object} options initialization object containing data yo'
 * @return {Foo}            Returns itself for chaining.
 */
Foo.prototype.init = function init ( options ) {
    var opts = options || null;

    if ( opts ) {
        this.doSomethingA();
    }
    else {
        this.doSomethingB();
    }
    return this;
};

/**
 * Sample method to demonstrate sinon usage in tests.
 * @return {Foo} Returns itself for chaining.
 */
Foo.prototype.doSomethingA = function doSomethingA () {
    // do something.
    return this;
};

/**
 * Sample method to demonstrate sinon usage in tests.
 * @return {Foo} Returns itself for chaining.
 */
Foo.prototype.doSomethingB = function doSomethingB () {
    // do something.
    return this;
};

exports = module.exports = Foo;
