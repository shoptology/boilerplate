var TestDirective = require('./TestDirective');

controllers = angular.module('app.directives', ['app.services'])
    .controller('TestDirective', TestDirective);

