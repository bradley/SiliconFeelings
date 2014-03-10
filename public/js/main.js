requirejs.config({
	paths: {
		angular: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
		angularRoute: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min',
		angularResource: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-resource.min',
		angularAnimate: '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-animate.min',
		emoji: '//cdn.staticfile.org/emoji/0.2.2/emoji',
		io: '/socket.io/socket.io.js',
		$: '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
		three: '/vendor/js/three',
		trackballControls: '/vendor/js/TrackballControls',
		_: '/vendor/js/underscore-min'
	},
	shim: {
		'angular': {'exports': 'angular'},
		'angularRoute': ['angular'],
		'angularResource': ['angular'],
		'three': {'exports': 'three'},
		'trackballControls': ['three']
	},
	priority: [
		'angular'
	]
});

// http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

define([
	'angular',
	'app',
	'routes',
], function(angular, app, routes) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		angular.resumeBootstrap([app['name']]);
	});
});
