(function() {
	'use strict';

	angular
		.module('supermodular.demo')
		.factory('demoDataService', demoDataService);

	demoDataService.$inject = [];

	/* @ngInject */
	function demoDataService() {
		return {
			phoneNumber: '+306973216110',
			email: 'skounis@gmail.com',
			officeLocation: '37.7736854,-122.421034',
			facebookPage: 'https://www.facebook.com/ionicframework'
		};
	}
})();
