define(['angular', 'io'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.services', [])
		.factory('socket', ['$rootScope', function($rootScope) {
			// TODO: Adjust these options to better suit our needs once we know them.
		  var socket = io.connect('/', {

      });
		  return {
		  	connectionStatus: function() {
		  		return socket.socket.connected;
		  	},
		    on: function(eventName, callback) {
		      socket.on(eventName, function() {
		        var args = arguments;
		        $rootScope.$apply(function() {
		          callback.apply(socket, args);
		        });
		      });
		    },
		    emit: function(eventName, data, callback) {
		      socket.emit(eventName, data, function() {
		        var args = arguments;
		        $rootScope.$apply(function() {
		          if (callback) {
		            callback.apply(socket, args);
		          }
		        });
		      })
		    }
		  };
		}]);
});
