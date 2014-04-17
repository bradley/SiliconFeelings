define([], function() {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'Socket', function($scope, $sce, $rootScope, $http, $location, Socket) {


	  /* Setup */

	  $scope.socket;
	  $scope.tweet_data;
	  $rootScope.frame_class = 'home-view';
	  $rootScope.mastheadInner = 'masthead-inner';
	  $rootScope.connection_status = '';


    /* Scope Functions */

    $rootScope.$on('$locationChangeStart', function(event) {
			// NOTE: setTimeout forces this to be syncronous, saving us from a
			//  rootScope inProg error. http://docs.angularjs.org/error/$rootScope/inprog?p0=$apply
			setTimeout(function() {
				if ($scope.socket) {
					$scope.socket.disconnect();
					$scope.socket = null;
				}
			}, 100);
		});

    $scope.sceneReady = function(connection_status) {
    	//console.log('Resources Loaded');
    	$rootScope.connection_status = 'connecting...';
    	$scope.$apply();

    	// NOTE: Artificial timeout for desired UX. Not functionally necessary.
			setTimeout(function() {
				$scope.socket = Socket.init();
				setSocketListeners();
			}, 1400);
    }


	  /* Socket Listeners */

	  function setSocketListeners() {
	  	var socket = $scope.socket;

		  socket.on('init', SocketFunctions.init);
		  socket.on('connecting', SocketFunctions.connecting);
		  socket.on('connect', SocketFunctions.connect);
		  socket.on('connect_failed', SocketFunctions.connect_failed);
		  socket.on('disconnect', SocketFunctions.disconnect);
		  socket.on('error', SocketFunctions.error);
		  socket.on('reconnecting', SocketFunctions.connecting);
		  socket.on('reconnect', SocketFunctions.connect);
		 	socket.on('reconnect_failed', SocketFunctions.connect_failed);
		  socket.on('new_tweets', SocketFunctions.new_tweets);
		}

		function unsetSocketListeners() {
	  	var socket = $scope.socket;

		  socket.removeListener('init', SocketFunctions.init);
		  socket.removeListener('connecting', SocketFunctions.connecting);
		  socket.removeListener('connect', SocketFunctions.connect);
		  socket.removeListener('connect_failed', SocketFunctions.connect_failed);
		  socket.removeListener('disconnect', SocketFunctions.disconnect);
		  socket.removeListener('error', SocketFunctions.error);
		  socket.removeListener('reconnecting', SocketFunctions.connecting);
		  socket.removeListener('reconnect', SocketFunctions.connect);
		 	socket.removeListener('reconnect_failed', SocketFunctions.connect_failed);
		  socket.removeListener('new_tweets', SocketFunctions.new_tweets);
		}

		var SocketFunctions = {
			init: function() {

			},
			connecting: function() {
				$rootScope.connection_status = 'connecting...';
			},
			connect: function() {
				$rootScope.connection_status = 'connected';
			},
			connect_failed: function() {
				$rootScope.connection_status = 'failed to connect';
			},
			disconnect: function() {
				$rootScope.connection_status = 'disconnected';
			},
			error: function() {
				$rootScope.connection_status = 'error connecting';
			},
			reconnecting: function() {
				$rootScope.connection_status = 'reconnecting...';
			},
			new_tweets: function(tweets) {
				$scope.tweet_data = tweets;
			}
		};


	  // Because this has happened asynchronously we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicitly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
