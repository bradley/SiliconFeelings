define([], function() {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'SharedSocket', function($scope, $sce, $rootScope, $http, $location, SharedSocket) {


	  // Because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
