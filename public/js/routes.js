define(['angular', 'app'], function(angular, app) {
	'use strict';

  /* Routes */

	return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: '/partials/home/index.html',
      controller: 'earthController'
    });
    $routeProvider.otherwise({
      templateUrl: '/404.html'
    });
	}]);
});
