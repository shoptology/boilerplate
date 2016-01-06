(function() {
	'use strict';

	angular
		.module('supermodular.home', [
			'ionic',
			'ngCordova',
			'supermodular.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('home', {
					url: '/home',
					templateUrl: 'js/modules/home/home.html',
          controller: 'HomeController as vm'
				});
		});
})();
