define(['angular', 'three'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.directives', [])
		.directive('emojiPlanet', ['$rootScope', function($rootScope) {
    	return {
	      restrict: 'A',
	      scope: {
	        'width': '=',
	        'height': '='
	      },
	      link: function postLink(scope, element, attrs) {

	      	// Constants
	        var POS_X = 1800,
	        		POS_Y = 500,
	        		POS_Z = 1800,
	        		WIDTH = scope.width || 1000,
	        		HEIGHT = scope.height || 600;

			    var FOV = 45,
			    		NEAR = 1,
			    		FAR = 4000;


			    // Setup
			    var camera, scene, renderer, light;


	        scope.init = function() {

	          // Camera
	          camera = new THREE.PerspectiveCamera(FOV, (WIDTH / HEIGHT), NEAR, FAR);
				    camera.position.set(POS_X,POS_Y, POS_Z);
				    camera.lookAt(new THREE.Vector3(0,0,0));

	          // Scene
	          scene = new THREE.Scene();
	          scene.add(camera);

	         	// Renderer
	          renderer = new THREE.WebGLRenderer({ antialias: true });
	          renderer.setClearColor(0xffffff);
	          renderer.setSize(WIDTH, HEIGHT);

	          // Build Scene Components
	          addLights();
	          addEarth();

	          // Element is provided by the angular directive
	          element[0].appendChild(renderer.domElement);
	        };


	        function addLights() {
	        	scene.add(new THREE.AmbientLight(0x333333));

	          light = new THREE.DirectionalLight(0xffffff);
	          light.position.set(POS_X,POS_Y, POS_Z);
	          scene.add(light);
	        }

	        function addEarth() {
						var sphere = new THREE.SphereGeometry(600, 50, 50),
							//planetTexture = THREE.ImageUtils.loadTexture("images/earth_4k.jpg"),
								planetTexture = THREE.ImageUtils.loadTexture("images/earth_4k.jpg",{}, function() {
									// Call render once image has loaded.
									scope.render();
								}),
								material = new THREE.MeshPhongMaterial( {
									map: planetTexture,
									shininess: 0.2
            		}),
								earth = new THREE.Mesh(sphere, material);

			      scene.add(earth);
	        }


	        scope.render = function() {
	          //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	          //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	          camera.lookAt(scene.position);

	          renderer.render(scene, camera);
 						requestAnimationFrame(scope.render);
	        };

	        // Begin
	        scope.init();
	        //scope.render();

	      }
	    }
    }]);
});
