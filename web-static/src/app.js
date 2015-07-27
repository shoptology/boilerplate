/*** VENDOR ***/
require('bower/bootstrap-sass-official/assets/stylesheets/_bootstrap.scss');
require('bower/lodash/dist/lodash.js');
//require('bower/foundation/css/normalize.css');
require('bower/angular-ui-router/release/angular-ui-router');
require('bower/angular-sanitize/angular-sanitize.js');
require('bower/angular-animate/angular-animate.js');
require('bower/restangular/src/restangular.js');

$ = require('jquery');

/*** APPLICATION ***/

// Modules
require('./modules/controllers/controllers');
require('./modules/services/services');
require('./modules/directives/directives');
require('./modules/filters/filters');

// SCSS
require('./scss/app.scss');

// Init App
var app = angular.module('app', [
  // Vendor
  'ngSanitize',
  'ui.router',
  'restangular',
  'app.controllers',
  'app.services',
  'app.directives',
  'app.filters'
]);

// App config
app.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'hello.tpl.html',
      controller: 'MainCtrl as vm'
    });

});

angular.module('app.config', [])
.constant('VERSION', '1.0');


module.exports = app
