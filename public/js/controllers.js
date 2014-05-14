define(['angular', 'services'], function(angular) {
	'use strict';


	/* Controllers */

	return angular.module('myApp.controllers', [])
		.controller('aboutController', ['$scope', function($scope) {
			//
		}])
		.controller('homeController', ['$scope', '$sce', '$rootScope', '$http', '$location', '$timeout', 'Socket', function($scope, $sce, $rootScope, $http, $location, $timeout, Socket) {


		  /* Setup */

		  var scene_ready_timer, load_progress_timer, load_delay_timer;
		  $scope.tweet_data;
		  $scope.connection_status;
		  $scope.allow_emoji = false;
		  $scope.load_progress = 0.0;
		  $scope.load_visible = !($rootScope.earthResourcesLoaded);
		  $scope.connecting_visible = false;
		  $scope.webgl_disabled_notice_visible = false;

			if (!webgl_support()) {
				$scope.load_visible = false;
				$scope.webgl_disabled_notice_visible = true;
			}

	    /* Scope Functions */

			$scope.$on("$destroy", function() {
					$scope.load_visible = false;
	        if (scene_ready_timer) {
	        	$timeout.cancel(scene_ready_timer);
	        }
	        if (load_progress_timer) {
	        	$timeout.cancel(load_progress_timer);
	      	}
	      	if (load_delay_timer) {
	      		$timeout.cancel(load_delay_timer);
	      	}
	        unsetSocketListeners();
	    });

			var triggerSceneReady = function() {
				setSocketListeners();
				$scope.allow_emoji = true;
			}

			var updateLoadProgress = function(progress) {
				$scope.load_progress = progress;
				$scope.$apply();
				if ($scope.load_progress >= 1) {

					load_delay_timer = $timeout(function() {
		  			$scope.load_visible = false;
		  				$scope.$apply();
		  		}, 500);

				}
			}

			$scope.loadProgress = function(progress) {
				$timeout.cancel(load_progress_timer);
				load_progress_timer = $timeout(function() {
					updateLoadProgress(progress);
				}, 100);
			}

	    $scope.sceneReady = function() {
	    	$scope.connection_status = 'connecting';
	    	$scope.connecting_visible = true;
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
			  Socket.on('tweets', SocketFunctions.tweets);
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
			  Socket.off('tweets', SocketFunctions.tweets);
			}

			var SocketFunctions = {
				init: function() {

				},
				connecting: function() {
					$scope.connection_status = 'connecting';
					$scope.connecting_visible = true;
				},
				connect: function() {
					$scope.connection_status = 'connected';
					$scope.connecting_visible = false;
				},
				connect_failed: function() {
					$scope.connection_status = 'failed to connect';
					$scope.connecting_visible = false;
				},
				disconnect: function() {
					$scope.connection_status = 'disconnected';
					$scope.connecting_visible = false;
				},
				error: function() {
					$scope.connection_status = 'error connecting';
					$scope.connecting_visible = false;
				},
				reconnecting: function() {
					$scope.connection_status = 'reconnecting';
					$scope.connecting_visible = true;
				},
				tweets: function(tweets) {
					$scope.tweet_data = tweets;
				}
			};

			//SocketFunctions.connecting();
		}])
		.controller('unfoundController', ['$scope', function($scope) {
			//
		}]);
});
