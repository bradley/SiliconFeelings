define([], function() {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', function($scope, $sce, $rootScope, $http, $location) {
		$rootScope.frame_class = 'about-view';
		$rootScope.mastheadInner = '';

	  // Because this has happened asynchronously we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicitly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
