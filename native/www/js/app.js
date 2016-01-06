// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
    'ionic',
    'ngCordova',
    'ng-inject'
])

    .run(function($ionicPlatform, $cordovaDialogs, $state) {
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);

                //---Automatic Updates
                var deploy = new Ionic.Deploy();

                //console.log(Ionic.Deploy);

                //deploy.setChannel('dev');

                var systemUpdateOverlay = $('#system-update-overlay'),
                    currentOperation = $('#system-update-overlay .current-operation'),
                    currentOperationStatus = $('#system-update-overlay .current-operation-status'),
                    currentOperationHr = $('#system-update-overlay hr');

                var doUpdate = function() {
                    $('#system-update-overlay .current-operation').html('Downloading update');
                    deploy.update().then(function(res) {
                        console.log('Ionic Deploy: Update Success! ', res);
                        currentOperation.html('Applying update');

                        currentOperationStatus.html('');
                        currentOperationHr.css('width', '100%');
                    }, function(err) {
                            console.log('Ionic Deploy: Update error! ', err);
                        }, function(progress) {
                            console.log('Ionic Deploy: Progress... ', progress);

                            currentOperationStatus.html(progress + '%');
                            currentOperationHr.css('width', progress + '%');
                        });
                }

                var checkForUpdates = function() {
                    console.log('Ionic Deploy: Checking for updates');
                    var c = confirm('Check for updates?');
                    if (!c) {
                        return;
                    }
                    deploy.check().then(function(hasUpdate) {
                        if (hasUpdate) {
                            console.log('Ionic Deploy: Update available: ' + hasUpdate);
                            $cordovaDialogs.confirm('New update available, update now?', 'Automatic Updates')
                                .then(function(success) {
                                    if (success == 1) {
                                        systemUpdateOverlay.show();
                                        currentOperationHr.css('width', '0%');
                                        doUpdate();
                                    } else {
                                        initGoogle();
                                    }
                                }, function(err) {
                                        initGoogle();
                                    });
                        }
                    }, function(err) {
                            console.error('Ionic Deploy: Unable to check for updates', err);
                            initGoogle();
                        });
                }

                checkForUpdates();
                //---End Automatic Updates
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($urlRouterProvider, $compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/home');
    });
