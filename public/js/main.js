requirejs.config({
	urlArgs: "bust=" + (new Date()).getTime(),
  waitSeconds: 200,
	paths: {
		angular           : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min',
		angularRoute      : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-route.min',
		angularResource   : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-resource.min',
		angularAnimate    : '//ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular-animate.min',
		io                : '/socket.io/socket.io.js',
		three             : '/vendor/js/three.min',
		trackballControls : '/vendor/js/TrackballControls',
		$                 : '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
		_                 : '/vendor/js/underscore-min',
		circlemouse				: '/vendor/js/jquery.circlemouse',
		maskPass          : '/vendor/js/postprocessing/MaskPass',
		renderPass        : '/vendor/js/postprocessing/RenderPass',
		shaderPass        : '/vendor/js/postprocessing/ShaderPass',
		effectComposer    : '/vendor/js/postprocessing/EffectComposer',
		copyShader        : '/vendor/js/shaders/CopyShader',
		rgbShiftShader    : '/vendor/js/shaders/RGBShiftShader',
		badTVShader       : '/vendor/js/shaders/BadTVShader',
		tripShader        : '/vendor/js/shaders/ColorTripShader'
	},
	shim: {
		'angular'           : {'exports': 'angular'},
		'angularRoute'      : ['angular'],
		'angularResource'   : ['angular'],
		'three'             : {'exports': 'three'},
		'trackballControls' : ['three'],
		'circlemouse'				: ['$'],
		'copyShader'        : ['three'],
		'maskPass'          : ['three'],
		'renderPass'        : ['three'],
		'shaderPass'        : ['three'],
		'effectComposer'    : ['three', 'copyShader', 'maskPass'],
		'rgbShiftShader'    : ['three'],
		'badTVShader'       : ['three'],
		'tripShader'				: ['three']
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
