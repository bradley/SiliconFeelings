define([], function() {
	return ['$scope', '$rootScope', '$http', '$location', 'socket', function($scope, $rootScope, $http, $location, socket) {
	  $scope.message = "Foo Bar";

	  /* Socket Listeners */

	  socket.on('init', function (data) {
	    console.log(data.message);
	  });


	  // because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
