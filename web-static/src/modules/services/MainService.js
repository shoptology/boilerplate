module.exports = function (config, $q, Restangular) {
  // Public API
  var service = {
    sayHello: sayHello
  };

  return service;

  function sayHello () {
    return 'hello!';
  }

};
