define(['angular'], function(angular) {
    'use strict';

    var factory = function($http, $q, $window, API_URL) {

        var userInfo;




        /**
         * Logs a user into the application
         * @param  {String} email User Email Address
         * @param  {String} password User Password
         * @return {String} access_token  A user access token to access other page data
         */
        function login(email, password) {
            var deferred = $q.defer();

            $http.post(
                API_URL + 'login',
                {
                    email: email,
                    password: password
                } /*,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }*/
            ).then(function(result) {
                if (result.data && result.data.response && result.data.response.token) {
                    userInfo = {
                        accessToken: result.data.response.token.token,
                        user: result.data.response.token.user
                    };
                    setToken(result.data.response.token.token);
                    setUserSettings(result.data.response.token.user);

                    deferred.resolve(userInfo);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }


            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        /**
         * Logs user out of application
         */
        function logout() {

            $window.sessionStorage['userInfo'] = null;

            return true;
        }

        /**
         * Signs up a new user with our API
         * @param  {String} email User Email Address
         * @param  {String} password User Password (Confirmed with Controller)
         * @return {String} access_token  A user access token to access other page data
         */
        function signup(email, password) {
            var deferred = $q.defer();

            $http.post(API_URL + 'signup', {
                email: email,
                password: password
            }).then(function(result) {

                if (result.data && result.data.response && result.data.response) {
                    userInfo = {
                        accessToken: result.data.response.token,
                        user: result.data.response.user
                    };
                    setToken(result.data.response.token);
                    setUserSettings(result.data.response.user);

                    deferred.resolve(userInfo);
                } else {
                    deferred.reject(result.data.meta.errorDetail[0]);
                }

            }, function(error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }


        /**
         * Checks if user is logged in
         * @return {Boolean} User login state
         */
        function isLoggedIn() {
            if ($window.sessionStorage['token']) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * Gets the User Access token if it exists
         * @return string Access Token
         */
        function getAccessToken() {

            if ($window.sessionStorage['token']) {
                var info = JSON.parse($window.sessionStorage['token']);

                if (info && info.token) {
                    return info.token;
                } else {
                    return false;
                }

            } else {
                return false;
            }
        }

        function setToken(token) {
            if (token) {
                $window.sessionStorage['token'] = JSON.stringify(token);
                return true;
            } else {
                return false;
            }
        }

        function getUserSettings() {
            if ($window.sessionStorage['user']) {
                return JSON.parse($window.sessionStorage['user']);
            } else {
                return false;
            }
        }

        function setUserSettings(user) {
            if (user) {
                if(user.password) {
                    delete user.password;
                }
                $window.sessionStorage['user'] = JSON.stringify(user);
                return true;
            } else {
                return false;
            }
        }




        // Return all our public functions
        return {
            getAccessToken: getAccessToken,
            login: login,
            isLoggedIn: isLoggedIn,
            logout: logout,
            signup: signup,
            getUserSettings: getUserSettings
        };

    };

    factory.$inject = ['$http', '$q', '$window', 'API_URL'];
    return factory;
});
