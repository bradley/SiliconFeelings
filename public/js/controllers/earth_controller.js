define([], function() {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'socket', function($scope, $sce, $rootScope, $http, $location, socket) {


	  /* Setup */

	  $scope.tweet_data;
	  $scope.canvas_width = 1000;
    $scope.canvas_height = 600;
    $scope.connection_status = false;


	  /* Socket Listeners */

	  socket.on('init', function(data) {
	    console.log(data.message);
	  });

	  socket.on('connecting', function() {
	  	// TODO
	  });

	  socket.on('connect', function() {
	  	$scope.connection_status = true;
	  });

	  socket.on('disconnect', function() {
	  	$scope.connection_status = false;
	  });

	  socket.on('error', function() {
	  	$scope.connection_status = false;
	  });

	  socket.on('reconnecting', function() {
	  	// NOTE: Fires one or more times!
	  	// TODO
	  });

	  socket.on('reconnect', function() {
	  	$scope.connection_status = true;
	  });

	  socket.on('reconnect_failed', function() {
	   	// TODO
	 	});

	  socket.on('new_tweets', function(tweets) {
	  	$scope.tweet_data = tweets;
	  });


	  // Because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
