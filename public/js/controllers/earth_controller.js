define([], function() {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'SharedSocket', function($scope, $sce, $rootScope, $http, $location, SharedSocket) {


	  /* Setup */

	  $scope.socket;
	  $scope.tweet_data;


    /* Scope Functions */

    $scope.sceneReady = function(connection_status) {
    	//console.log('Resources Loaded');
    	$rootScope.connection_status = 'connecting...';
    	$scope.$apply();

    	// NOTE: Artificial timeout for desired UX. Not functionally necessary.
			setTimeout(function() {
				$scope.socket = new SharedSocket();
				setSocketListeners();
			}, 1400);
    }


	  /* Socket Listeners */

	  function setSocketListeners() {
	  	var socket = $scope.socket;

		  socket.on('init', function(data) {

		  });

		  socket.on('connecting', function() {
		  	$rootScope.connection_status = 'connecting...';
		  });

		  socket.on('connect', function() {
		  	$rootScope.connection_status = 'connected';
		  });

		  socket.on('connect_failed', function() {
		  	$rootScope.connection_status = 'failed to connect';
		   	// TODO
		 	});

		  socket.on('disconnect', function() {
		  	$rootScope.connection_status = 'disconnected';
		  });

		  socket.on('error', function() {
		  	$rootScope.connection_status = 'error connecting';
		  });

		  socket.on('reconnecting', function() {
		  	$rootScope.connection_status = 'reconnecting...';
		  	// NOTE: Fires one or more times!
		  	// TODO
		  });

		  socket.on('reconnect', function() {
		  	$rootScope.connection_status = 'connected';
		  });

		 	socket.on('reconnect_failed', function() {
		  	$rootScope.connection_status = 'failed to connect';
		   	// TODO
		 	});

		  socket.on('new_tweets', function(tweets) {
		  	$scope.tweet_data = tweets;
		  });
		}


	  // Because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
