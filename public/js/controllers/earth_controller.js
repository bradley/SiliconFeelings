define([], function() {
	return ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {
	  $scope.message = "Foo Bar"

	  // because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
