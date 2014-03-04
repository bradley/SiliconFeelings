define(['angular', 'three', 'trackballControls'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.directives', [])
		.directive('emojiPlanet', ['$rootScope', function($rootScope) {
    	return {
	      restrict: 'E',
	      scope: {
	        'width': '=',
	        'height': '=',
	        'tweetData': '='
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
							camera, scene, renderer, controls, light, earth,
							tweets = [];


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
	        	// TODO: Play with the colors for these lights!
	        	scene.add(new THREE.AmbientLight(0x333333));

	          light = new THREE.DirectionalLight(0xffffff);
	          light.position.set(POS_X,POS_Y, POS_Z);
	          scene.add(light);
	        }

	        function addEarth() {
						var sphere = new THREE.SphereGeometry(RADIUS, 50, 50),
							//planetTexture = THREE.ImageUtils.loadTexture("vendor/images/earth_8k.jpg"),
							// TODO/NEXT: When we get to loading the emoji sprite sheet it will probably make more sense to load all
							//   of these sort of resources together (with UI updates) prior to calling init.
							planetTexture = THREE.ImageUtils.loadTexture("vendor/images/earth_4k_color1.jpg", {}, firstRender),
							material = new THREE.MeshPhongMaterial({
								map: planetTexture,
								shininess: 0.2
          		});

						earth = new THREE.Mesh(sphere, material);
			      scene.add(earth);
	        }

			    function addPoints() {
            var material = new THREE.MeshNormalMaterial(),
            		cube = new THREE.CubeGeometry(25, 25, 25);

            _.each(tweets, function(tweet) {
            	// Convert earth coordinate to point in 3d space relative to our earth sphere.
	          	var lon = parseInt(tweet.coordinates[0]),
	          			lat = parseInt(tweet.coordinates[1]),
	          			position = latLonToVector3(lon, lat);

	          	// Create new object at our position and tell it to 'look at' the center of our scene (center of earth).
	          	var object = new THREE.Mesh(cube, material);
            	object.position = position;
            	object.lookAt( new THREE.Vector3(0,0,0) );

            	// Add to scene.
            	// TODO: Look into merging geometries for performance (but find an updated example):
            	//   http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
            	scene.add(object);
            	setTimeout(function() {
            		// TODO: Rather than N timouts, let's look into having a single interval that checks for old data points
            		// and removes them.
            		scene.remove(object);
            	}, 2000);
            });
			    }

			    function latLonToVector3(lon, lat) {
		        var distance_from_surface = 20,
		        		phi = (lat) * Math.PI / 180,
		        		theta = (lon - 180) * Math.PI / 180,
		        		x = -(RADIUS + distance_from_surface) * Math.cos(phi) * Math.cos(theta),
		        		y = (RADIUS + distance_from_surface) * Math.sin(phi),
		        		z = (RADIUS + distance_from_surface) * Math.cos(phi) * Math.sin(theta);

		        return new THREE.Vector3(x, y, z);
			    }

			    /*
			    function clearScene() {
				    _.each(data_points, function( object ) {
			          scene.remove(object);
				    });
				    data_points = [];
					}
					*/


			    /* Watches */

			    scope.$watch('tweetData', function(new_data, old_data) {
			    	if (new_data) {
			    		tweets = new_data;
			    		addPoints();
			    	}
				  });


	        /* Lifecycle */

	        function firstRender() {
	        	// Set controls and call render once images have loaded.
	        	controls = new THREE.TrackballControls(camera, renderer.domElement);
	        	scope.render();
	        }

	        scope.render = function() {
	          controls.update();

	          renderer.render(scene, camera);
 						requestAnimationFrame(scope.render);
	        };


	        scope.init();
	      }
	    }
    }]);
});
