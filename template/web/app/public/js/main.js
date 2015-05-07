/*global requirejs, document, window, navigator, console */

requirejs.config({
    paths: {
        angular: '../../bower_components/angular/angular',
        uiRouter: '../../bower_components/angular-ui-router/release/angular-ui-router'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        uiRouter: {
            deps: ['angular']
        },
        socketIo: {
            deps: ['angular']
        }
    },
    priority: [
        'angular'
    ],
    deps: [
        'bootstrap'
    ]
});
