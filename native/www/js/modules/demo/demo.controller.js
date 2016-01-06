(function() {
	'use strict';

	angular
		.module('supermodular.demo')
		.controller('DemoController', demoController);

	demoController.$inject = ['menuItems', 'demoDataService'];

	/* @ngInject */
	function demoController(menuItems, demoDataService) {
		var vm = angular.extend(this, {
			entries: menuItems,
			phoneNumber: demoDataService.phoneNumber,
			getDirections: getDirections,
			sendEmail: sendEmail,
			openFacebookPage: openFacebookPage
		});

		function getDirections() {
			externalAppsService.openMapsApp(demoDataService.officeLocation);
		}

		function sendEmail() {
			$cordovaEmailComposer.isAvailable().then(function() {
				var email = {
					to: demoDataService.email,
					subject: 'Cordova Icons',
					body: 'How are you? Nice greetings from Leipzig'
				};

				$cordovaEmailComposer.open(email);
			});
		}

		function openFacebookPage() {
			externalAppsService.openExternalUrl(demoDataService.facebookPage);
		}

	}
})();
