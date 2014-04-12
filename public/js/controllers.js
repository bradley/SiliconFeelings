define(['angular', 'services'], function(angular) {
	'use strict';


	/* Controllers */

	return angular.module('myApp.controllers', [])
		.controller('earthController', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/earth_controller'], function(earth_controller) {
				$injector.invoke(earth_controller, this, { '$scope': $scope });
			});
		}])
		.controller('aboutController', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/about_controller'], function(about_controller) {
				$injector.invoke(about_controller, this, { '$scope': $scope });
			});
		}]);
});
