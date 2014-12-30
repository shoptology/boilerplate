/*global define, require */

define(['app'], function(app) {
    'use strict';

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('dashboard', {
                    url: "/dashboard",
                    templateUrl: "js/views/dashboard.html",
                    controller: 'DashboardCtrl',
                    authenticate: true
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'js/views/login.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: 'js/views/signup.html',
                    controller: 'LoginCtrl',
                    authenticate: false
                })

            $urlRouterProvider.otherwise("/login");
    }]);


});
