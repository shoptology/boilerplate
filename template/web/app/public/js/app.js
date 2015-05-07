/*global define, require */

define(['angular',
    'uiRouter',
    'config',
    'filters/filters',
    'services/services',
    'directives/directives',
    'controllers/controllers'
], function(angular, uiRouter) {
        'use strict';

        var app = angular.module('app', [
            'app.controllers',
            'app.filters',
            'app.services',
            'app.directives',
            'app.config',
            'ui.router'
        ]);

        app.run(function($rootScope, $state, UserService) {

            // Check if Page requires authentication
            $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
                if (toState.authenticate && !UserService.isLoggedIn()) {
                    // User isn’t authenticated
                    console.log('Not logged in');
                    $state.transitionTo('login');
                    event.preventDefault();

                }
                console.log('Route changed');

            });


        });


        return app;

    });
