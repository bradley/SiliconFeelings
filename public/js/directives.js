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


	      	/* Setup */

	        var POS_X = 1800,
	        		POS_Y = 500,
	        		POS_Z = 1800,
	        		WIDTH = scope.width || 1000,
	        		HEIGHT = scope.height || 600,
	        		FOV = 45,
			    		NEAR = 1,
			    		FAR = 4000,
			    		RADIUS = 900, // TODO: Make this dynamic with canvas size?
							camera, scene, renderer, light;


			    var test_data = [{"emoji":"😝","coordinates":[-75.30613222,39.95309161]}, {"emoji":"😏","coordinates":[-83.64896659,43.0459068]}, {"emoji":"👏","coordinates":[-89.66125108,35.26079232]}, {"emoji":"😭","coordinates":[-122.41046711,37.73588451]}];

			    /* Initialize */

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
	          addPoints();

	          // Element is provided by the angular directive
	          element[0].appendChild(renderer.domElement);
	        };


	        /* Helpers */

	        function addLights() {
	        	scene.add(new THREE.AmbientLight(0x333333));

	          light = new THREE.DirectionalLight(0xffffff);
	          light.position.set(POS_X,POS_Y, POS_Z);
	          scene.add(light);
	        }

	        function addEarth() {
						var sphere = new THREE.SphereGeometry(900, 50, 50),
							//planetTexture = THREE.ImageUtils.loadTexture("images/earth_4k.jpg"),
								planetTexture = THREE.ImageUtils.loadTexture("images/earth_8k.jpg", {}, function() {
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

	        function latLonToVector3(lon, lat) {
		        var distance_from_surface = 10,
		        		phi = (lat) * Math.PI / 180,
		        		theta = (lon - 180) * Math.PI / 180,
		        		x = -(RADIUS + distance_from_surface) * Math.cos(phi) * Math.cos(theta),
		        		y = (RADIUS + distance_from_surface) * Math.sin(phi),
		        		z = (RADIUS + distance_from_surface) * Math.cos(phi) * Math.sin(theta);

		        return new THREE.Vector3(x, y, z);
			    }

			    function addPoints() {
            var material = new THREE.MeshNormalMaterial(),
            		cube = new THREE.CubeGeometry(25, 25, 25);

	          for (var i = 0 ; i < test_data.length-1 ; i++) {

	          	// Convert earth coordinate to point in 3d space relative to our earth sphere.
	          	var lon = parseInt(test_data[i].coordinates[0]),
	          			lat = parseInt(test_data[i].coordinates[1]),
	          			position = latLonToVector3(lon, lat);

	          	// Create new object at our position and tell it to 'look at' the center of our scene (center of earth).
	          	var object = new THREE.Mesh(cube, material);
            	object.position = position;
            	object.lookAt( new THREE.Vector3(0,0,0) );

            	// Add to scene.
            	// TODO: Look into merging geometries for performance (but find an updated example):
            	//   http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
            	scene.add(object);
	          }
			    }


	        /* Lifecycle */

	        scope.render = function() {
	          //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	          //camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	          camera.lookAt(scene.position);

	          renderer.render(scene, camera);
 						requestAnimationFrame(scope.render);
	        };

	        scope.init();
	        scope.render();
	      }
	    }
    }]);
});
