define(['angular', 'three'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.directives', [])
		.directive('emojiPlanet', ['$rootScope', function($rootScope) {
    	return {
	      restrict: 'A',
	      scope: {
	        'width': '=',
	        'height': '=',
	        'fillcontainer': '=',
	        'scale': '=',
	        'materialType': '='
	      },
	      link: function postLink(scope, element, attrs) {

	        var camera, scene, renderer,
	          shadowMesh, icosahedron, light,
	          mouseX = 0, mouseY = 0,
	          contW = (scope.fillcontainer) ? element[0].clientWidth : scope.width,
	          contH = scope.height,
	          windowHalfX = contW / 2,
	          windowHalfY = contH / 2,
	          materials = {};


	        scope.init = function() {

	          // Camera
	          camera = new THREE.PerspectiveCamera( 20, contW / contH, 0.1, 10000 );
	          camera.position.z = 1800;

	          // Scene
	          scene = new THREE.Scene();

	          // Lighting
	          light = new THREE.DirectionalLight( 0xffffff );
	          light.position.set( 5,3,5 );
	          scene.add( light );


	          var radius = 200,
	            	geometry  = new THREE.IcosahedronGeometry( radius, 1 );


	          materials.lambert = new THREE.MeshLambertMaterial({
	            color: 0xffffff,
	            shading: THREE.FlatShading,
	            vertexColors: THREE.VertexColors
	          });

	          // Build and add the icosahedron to the scene
	          icosahedron = new THREE.Mesh( geometry, materials.lambert );
	          icosahedron.position.x = 0;
	          icosahedron.rotation.x = 0;
	          scene.add( icosahedron );

	          renderer = new THREE.WebGLRenderer( { antialias: true } );
	          renderer.setClearColor( 0xffffff );
	          renderer.setSize( contW, contH );

	          // element is provided by the angular directive
	          element[0].appendChild( renderer.domElement );
	        };


	        scope.render = function() {

	          //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	          camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

	          camera.lookAt( scene.position );

	          renderer.render( scene, camera );
	        };

	        // Begin
	        scope.init();
	        scope.render();

	      }
	    }
    }]);
});
