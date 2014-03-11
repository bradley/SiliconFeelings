define(['angular', 'three', 'trackballControls'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.directives', [])
		.directive('emojiPlanet', ['$rootScope', '$http', function($rootScope, $http) {
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
							planet_texture, planet_specular_texture, emoji_sprites, emoji_sprite_mappings,
							emoji_sprites_new = new Image(),
							emoji_sprite_sheet_width, emoji_sprite_sheet_height,
							tweets = [];

					var scene_ready = false;


			    /* Initialize */

	        scope.init = function() {
	        	// Load Images Prior to Rendering the Scene
	        	loadResources(function() {
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
		          addFog();
		          addPoints();

		          // NOTE: Element is provided by the angular directive
		          element[0].appendChild(renderer.domElement);
		          controls = new THREE.TrackballControls(camera, renderer.domElement);

		          // TODO: Dont like this. The rationale is that our tweetData watcher might get called before the scene is ready. Think on it.
		          scene_ready = true;
		        	scope.render();
	        	});
	        };


	        /* Helpers */

	        // Calls callback (no parameters) after all resources have loaded.
	        function loadResources(callback) {
	        	// TODO: _Really_ need to rethink this chaining. It works but could get unwieldy quickly.
	        	$http.get('vendor/emoji_sprite_sheet_small.json').success(function(data) {
				    	emoji_sprite_mappings = data.frames;
				    	emoji_sprite_sheet_width = data.meta.size.w;
				    	emoji_sprite_sheet_height = data.meta.size.h;

				    	emoji_sprites_new.onload = function() {
				        mapEmojiTextures(function() {
				    			planet_texture = THREE.ImageUtils.loadTexture("vendor/images/earth.jpg", {}, function() {
				        		planet_specular_texture = THREE.ImageUtils.loadTexture("vendor/images/specular.png", {}, function() {
					        		callback();
					        	});
				        	});
				    		});
				      };

				      // Set src for image so that the onload event is triggered.
				    	emoji_sprites_new.src = 'vendor/images/emoji_sprite_sheet_small.png';
				  	});
	        }

	        // Creates a reusable material for each emoji using our spritesheet.
	        function mapEmojiTextures(callback) {
						for(var key in emoji_sprite_mappings) {
							var sprite_info = emoji_sprite_mappings[key],
									sprite_frame = sprite_info['frame'],
									canvas = document.createElement('canvas'),
									context = canvas.getContext('2d'),
									texture,
									material;

							canvas.width = sprite_frame.w;
							canvas.height = sprite_frame.h;

							texture = new THREE.Texture(canvas);

							context.drawImage(
								emoji_sprites_new,   // Image
								sprite_frame.x,      // The x coordinate where to start clipping.
								sprite_frame.y,      // The y coordinate where to start clipping
								sprite_frame.w,      // The width of the clipped image.
								sprite_frame.h,      // The height of the clipped image.
								0,                   // The x coordinate where to place the image on the canvas.
								0,                   // The y coordinate where to place the image on the canvas.
								sprite_frame.w,      // The width of the image to use (stretch or reduce the image).
								sprite_frame.h       // The height of the image to use (stretch or reduce the image)
							);

							texture.needsUpdate = true; // Important!

							material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });

							// Add new key/value to current emoji object in emoji_sprite_mappings for this texture.
							sprite_info.sprite = material;
						}
						callback();
	        }

	        function addLights() {
	        	var main_light = light = new THREE.DirectionalLight(0xffffff, 0.4),
	        			spot_light = new THREE.SpotLight(0xffffff, 1.25),
	        			ambient_light = new THREE.AmbientLight(0x282F3E),
	        			backlight = new THREE.DirectionalLight(0x282343, 0.8);

	        	scene.add(ambient_light);

	          // NOTE: We are adding the light to our camera and not the scene.
	          //  Our trackball control (camera rotating functionality) rotates the
	          //  camera so if we need a fixed light it must be part of the camera and
	          //  not the scene. Our positioning is also relative to the camera.
	          camera.add(main_light);
	          main_light.position.set(-1800, 1800, 780);

	    			// Additional glow on top left of Earth.
	    			camera.add(spot_light);
	          spot_light.position.set(-1800, 1800, 780);
	          spot_light.exponent = 70.0;

	          // Just a hint of dark light at the bottom right of Earth.
	          camera.add(backlight);
	          backlight.position.set(2400, -2400, -3000)

	        }

	        function addEarth() {
						var sphere = new THREE.SphereGeometry(RADIUS, 50, 50),
								material = new THREE.MeshPhongMaterial({
									map: planet_texture,
									shininess: 0.1
	          		});

						material.specularMap = planet_specular_texture;
						material.specular = new THREE.Color('white');
						earth = new THREE.Mesh(sphere, material);

			      scene.add(earth);
	        }

	        function addFog() {
	        	var start = 1986,
	        			end = 2300;
	        	scene.fog = new THREE.Fog(0xffffff, start, end);
	        }

	        function addPoints() {
            var plane = new THREE.PlaneGeometry(67, 67),
           			geo = new THREE.Geometry(),
           			mesh = new THREE.Mesh(plane),
           			materials = [];;

            _.each(tweets, function(tweet, index) {
            	// Convert earth coordinate to point in 3d space relative to our earth sphere.
	          	var lon = parseInt(tweet.coordinates[0]),
	          			lat = parseInt(tweet.coordinates[1]),
	          			sprite_info = emoji_sprite_mappings[tweet.unified.toLowerCase()],
	          			position = lonLatToVector3(lon, lat);

	          	// Ensure we found a sprite for the given emoji unified unicode.
	          	if (sprite_info) {
	          		var sprite = sprite_info.sprite;

	          		// NOTE: Prepare for merger with geo object.
	          		//   http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
	          		materials.push(sprite);
	          		mesh.geometry.faces = setFaceIndexes(mesh.geometry.faces, index);

		          	// Make plane visible on top and bottom.
		          	mesh.material.side = THREE.DoubleSide; // TODO: make sure this isnt a problem with emoji textures.
		          	// Position mesh on correct coordinate relative to the Earth in 3D space.
	            	mesh.position = position;
	            	// Tell mesh to look away from the center of the scene (the center of the Earth sphere).
	            	lookAwayFromCenter(mesh);

	            	// NOTE: Combine geometries for less draw calls
	          		//   http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
	            	THREE.GeometryUtils.merge(geo, mesh);
	          	}

            });

						var total = new THREE.Mesh(geo, new THREE.MeshFaceMaterial(materials));
						total.matrixAutoUpdate = false;
          	scene.add(total);

          	setTimeout(function() {
          		// TODO: Rather than N timouts, let's look into having a single interval that checks for old data points
          		// and removes them.
          		scene.remove(total);
          	}, 2000);
			    }

			   	function setFaceIndexes(faces, index) {
			    	// NOTE: This make it possible to change the material Index manually.
        		//   This is especcially handy when you start to merge generated geometries with different materials.
        		//	 More: https://github.com/mrdoob/three.js/pull/2817 (since removed: https://github.com/mrdoob/three.js/releases/tag/r60)
						for ( var i = 0; i <= (faces.length - 1); i ++ ) {
							faces[i].materialIndex = index;
		 				}
		 				return faces;
			    }

			    function lookAwayFromCenter(object) {
			    	var v = new THREE.Vector3();
					    v.subVectors(object.position, new THREE.Vector3(0,0,0)).add(object.position);
					    object.lookAt(v);
			    }

			    // Convert a latitude/lon
			   	function lonLatToVector3(lon, lat) {
		        var distance_from_surface = 20,
		        		phi = (lat) * Math.PI / 180,
		        		theta = (lon - 180) * Math.PI / 180,
		        		x = -(RADIUS + distance_from_surface) * Math.cos(phi) * Math.cos(theta),
		        		y = (RADIUS + distance_from_surface) * Math.sin(phi),
		        		z = (RADIUS + distance_from_surface) * Math.cos(phi) * Math.sin(theta);

		        return new THREE.Vector3(x, y, z);
			    }


			    /* Watches */

			    scope.$watch('tweetData', function(new_data, old_data) {
			    	if (scene_ready && new_data) {
			    		tweets = new_data;
			    		addPoints();
			    	}
				  });


	        /* Lifecycle */

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
