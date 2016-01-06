(function() {
	'use strict';

	angular
		.module('supermodular.demo', [
			'ionic',
			'ngCordova',
			'supermodular.common'
		])
		.config(function($stateProvider) {
			$stateProvider
				.state('demo', {
					url: '/demo',
					templateUrl: 'js/modules/demo/demo.html',
          controller: 'DemoController as vm'
				});
		});
})();
