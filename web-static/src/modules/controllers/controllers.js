var MainCtrl = require('./MainCtrl');

controllers = angular.module('app.controllers', ['app.services', 'app.config'])
    .controller('MainCtrl', MainCtrl);

