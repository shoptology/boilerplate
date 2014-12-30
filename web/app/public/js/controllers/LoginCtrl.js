/*global define, console */

define(function() {
    'use strict';

    function ctrl($scope, $state, UserService) {
        /*var loggedin = true;

        if(loggedin) {
            $state.go('tab.home');
        }*/

        $scope.signIn = function() {
            $state.go('login');
        };

        $scope.signUp = function() {
            $state.go('signup');
        };

        $scope.login = function(user) {
            console.log('logging in');

            if (user && user.email && user.pass) {
                var checkLogin = UserService.login(user.email, user.pass);
                checkLogin.then(function(userInfo) {
                    console.log(userInfo);
                    $state.go('dashboard');
                }, function(reason) {
                        console.log('Failed:', reason);
                        $scope.errorMsg = reason;
                    });
            } else {
                $scope.errorMsg = 'Please add your email and password.';
            }


        };

        $scope.facebookLogin = function() {
            // Launch OAUTH process
        };

        $scope.register = function(user) {
            // Create account and sync to local
            console.log('signing up');

            if (user && user.email && user.pass && user.confirm) {

                if (user.pass !== user.confirm) {
                    $scope.errorMsg = 'Passwords do not match';
                    return false;
                }

                //TODO: Check passwords to match
                var checkLogin = UserService.signup(user.email, user.pass);
                checkLogin.then(function(userInfo) {
                    console.log(userInfo);
                    $state.go('dashboard');
                }, function(reason) {
                        console.log('Failed:', reason);
                        $scope.errorMsg = reason;
                    });

            } else {
                $scope.errorMsg = 'Please fill in all fields';
            }


        };

        $scope.facebookRegister = function() {
            // Launch OAUTH process
        };

        $scope.selectRole = function(role) {
            // Log role locally, push to server if needed
            console.log(role);

            // Go to school selection
            $state.go('search');
        };
    }

    ctrl.$inject = ['$scope', '$state', 'UserService'];
    return ctrl;

});
