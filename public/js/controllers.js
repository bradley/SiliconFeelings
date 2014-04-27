define(['angular', 'services'], function(angular) {
	'use strict';


	/* Controllers */

	return angular.module('myApp.controllers', [])
		.controller('aboutController', ['$scope', function($scope) {
			//
		}])
		.controller('homeController', ['$scope', '$sce', '$rootScope', '$http', '$location', '$timeout', 'Socket', function($scope, $sce, $rootScope, $http, $location, $timeout, Socket) {


		  /* Setup */

		  var scene_ready_timer;
		  $scope.tweet_data;
		  $scope.connection_status;
		  $scope.allow_emoji = false;


	    /* Scope Functions */

			$scope.$on("$destroy", function() {
	        if (scene_ready_timer) {
	        	$timeout.cancel(scene_ready_timer);
	        }
	        unsetSocketListeners();
	    });

			var triggerSceneReady = function() {
				setSocketListeners();
				$scope.allow_emoji = true;
			}

	    $scope.sceneReady = function(connection_status) {
	    	$scope.connection_status = 'connecting...';
	    	$scope.$apply();

	    	// NOTE: Artificial timeout for desired UX. Not functionally necessary.
				scene_ready_timer = $timeout(triggerSceneReady, $rootScope.artificial_timeout_time);
	    }


		  /* Socket Listeners */

		  function setSocketListeners() {
		  	if (Socket.connectionStatus()) {
		  		SocketFunctions.connect();
		  	}
			  Socket.on('init', SocketFunctions.init);
			  Socket.on('connecting', SocketFunctions.connecting);
			  Socket.on('connect', SocketFunctions.connect);
			  Socket.on('connect_failed', SocketFunctions.connect_failed);
			  Socket.on('disconnect', SocketFunctions.disconnect);
			  Socket.on('error', SocketFunctions.error);
			  Socket.on('reconnecting', SocketFunctions.connecting);
			  Socket.on('reconnect', SocketFunctions.connect);
			 	Socket.on('reconnect_failed', SocketFunctions.connect_failed);
			  Socket.on('new_tweets', SocketFunctions.new_tweets);
			}

			function unsetSocketListeners() {
			  Socket.off('init', SocketFunctions.init);
			  Socket.off('connecting', SocketFunctions.connecting);
			  Socket.off('connect', SocketFunctions.connect);
			  Socket.off('connect_failed', SocketFunctions.connect_failed);
			  Socket.off('disconnect', SocketFunctions.disconnect);
			  Socket.off('error', SocketFunctions.error);
			  Socket.off('reconnecting', SocketFunctions.connecting);
			  Socket.off('reconnect', SocketFunctions.connect);
			 	Socket.off('reconnect_failed', SocketFunctions.connect_failed);
			  Socket.off('new_tweets', SocketFunctions.new_tweets);
			}

			var SocketFunctions = {
				init: function() {

				},
				connecting: function() {
					$scope.connection_status = 'connecting...';
				},
				connect: function() {
					$scope.connection_status = 'connected';
				},
				connect_failed: function() {
					$scope.connection_status = 'failed to connect';
				},
				disconnect: function() {
					$scope.connection_status = 'disconnected';
				},
				error: function() {
					$scope.connection_status = 'error connecting';
				},
				reconnecting: function() {
					$scope.connection_status = 'reconnecting...';
				},
				new_tweets: function(tweets) {
					$scope.tweet_data = tweets;
				}
			};

			SocketFunctions.connecting();
		}]);
});
