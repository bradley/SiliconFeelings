define(['angular', 'three', 'trackballControls', 'effectComposer', 'renderPass', 'shaderPass', 'rgbShiftShader', 'badTVShader'], function(angular) {
	'use strict';

  /* Services */

	angular.module('myApp.directives', [])
		.directive('emojiPlanet', ['$rootScope', '$http', function($rootScope, $http) {
    	return {
	      restrict: 'E',
	      scope: {
	        'width': '=',
	        'height': '=',
	        'tweetData': '=',
	        'socket': '=',
	        'sceneReady': '&onLoad'
	      },
	      link: function postLink(scope, element, attrs) {


	      	/* Setup */

	      	// Constants
	        var width = scope.width || 1000,
	        		height = scope.height || 600,
	        		pos_x = width / 2,
	        		pos_y = height / 2,
	        		pos_z = 2540,
	        		fov = 45,
			    		near = 1,
			    		far = 4000,
			    		radius = 900, // TODO: Make this dynamic with canvas size?
			    		center_of_scene = new THREE.Vector3(0,0,0);

			    // Scene Components
					var camera,
							scene,
							renderer,
							composer,
							controls,
							light,
							earth;

					// Earth Components
					var planet_texture,
							planet_specular_texture;

					// Emoji Components
					var emoji_sprites_new = new Image(),
							emoji_sprites,
							emoji_sprite_mappings,
							emoji_sprite_sheet_width,
							emoji_sprite_sheet_height;

					// Postprocessing Components
					var rgbEffect,
							tvEffect,
							copyPass,
							renderPass,
							step = 0;

					// Scope Data
					var tweets = [],
							current_socket;

					// Etc.
					var scene_ready = false,
							interaction_initiated = false;


			    /* Initialize */

	        scope.init = function() {
	        	// Load Images Prior to Rendering the Scene
	        	loadResources(function() {
	        		// Camera
		          camera = new THREE.PerspectiveCamera(fov, (width / height), near, far);
					    camera.position.set(pos_x, pos_y, pos_z);
					    camera.lookAt(center_of_scene);

		          // Scene
		          scene = new THREE.Scene();
		          scene.add(camera);

		         	// Renderer
		          renderer = new THREE.WebGLRenderer({ antialias: true });
		          renderer.setClearColor(0xffffff);
		          renderer.setSize(width, height);

		          // Build Scene Components
		          addLights();
		          addEarth();
		          addFog();

		          // NOTE: Element is provided by the angular directive
		          element[0].appendChild(renderer.domElement);
		          //controls = new THREE.TrackballControls(camera, renderer.domElement);

		          // Postprocessing
		          addPostprocessing();

		          scene_ready = true;
		          scope.sceneReady();
		        	scope.render();
	        	});
	        };


	        /* Helpers */

	        // Loads all resources, after which calling its callback which allows scene to continue initializing.
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

	        // Creates a reusable material for each emoji using our spritesheet, and updates emoji sprite sheet json mapper.
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

							// Add clipped emoji to canvas - minimizing size of texture.
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

							texture.needsUpdate = true;

							material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });

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
	          spot_light.position.set(-900, 1800, 780);
	          spot_light.exponent = 70.0;

	          // Just a hint of dark light at the bottom right of Earth.
	          camera.add(backlight);
	          backlight.position.set(2400, -2400, -3000)

	        }

	        function addEarth() {
						var sphere = new THREE.SphereGeometry(radius, 50, 50),
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
            		mesh = new THREE.Mesh(plane),
           			geo = new THREE.Geometry(),
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

			    function addPostprocessing() {
							composer = new THREE.EffectComposer(renderer);

		          renderPass = new THREE.RenderPass(scene, camera);
							composer.addPass(renderPass);

							rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
							rgbEffect.uniforms['amount'].value = 0.007;
							composer.addPass(rgbEffect);

							tvEffect = new THREE.ShaderPass(THREE.BadTVShader);
							tvEffect.uniforms['distortion'].value = 1.4;
							tvEffect.uniforms['distortion2'].value = 2.1;
							tvEffect.uniforms['speed'].value = 0.04;
							tvEffect.uniforms['rollSpeed'].value = 0.0;
							composer.addPass(tvEffect);

							copyPass = new THREE.ShaderPass(THREE.CopyShader);
							composer.addPass(copyPass);

							copyPass.renderToScreen = true;
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
					    v.subVectors(object.position, center_of_scene).add(object.position);
					    object.lookAt(v);
			    }

			    // Convert a lon/lat to a point on our Earth sphere.
			   	function lonLatToVector3(lon, lat) {
		        var distance_from_surface = 20,
		        		phi = (lat) * Math.PI / 180,
		        		theta = (lon - 180) * Math.PI / 180,
		        		x = -(radius + distance_from_surface) * Math.cos(phi) * Math.cos(theta),
		        		y = (radius + distance_from_surface) * Math.sin(phi),
		        		z = (radius + distance_from_surface) * Math.cos(phi) * Math.sin(theta);

		        return new THREE.Vector3(x, y, z);
			    }

			    function showGlitchyEarthIfDisconnected() {
			    	composer = new THREE.EffectComposer(renderer);
						composer.addPass(renderPass);
				  	if (!current_socket.connectionStatus() && scene_ready) {
				  		composer.addPass(rgbEffect);
				  		composer.addPass(tvEffect);
				  		composer.addPass(copyPass);
							copyPass.renderToScreen = true;
				  	}
			    }

			    function updateCameraPosition(step) {
			    	if (interaction_initiated) {
			    		controls.update();
			    		return;
			    	}
			    	// Rotate earth if interaction is not enabled.
			    	var degree = step * (Math.PI / 180);
						camera.position.x = pos_x * Math.cos(degree) - pos_z * Math.sin(degree);
            camera.position.y = (pos_y);
            camera.position.z = pos_z * Math.cos(degree) + pos_x * Math.sin(degree);
            camera.lookAt(center_of_scene);
			    }


			    /* Listeners */

			    element.on('mousedown', function(e) {
			    	if (scene_ready) {
				    	controls = new THREE.TrackballControls(camera, renderer.domElement);
				    	controls.forceMousedown(e); // Tell control about this mousedown event.
				    	interaction_initiated = true;
				    	element.unbind('mousedown'); // We only need to listen for mousedown once.
				    }
			    });

			    function setSocketListeners() {
				    current_socket.on('connect', function() {
					  	showGlitchyEarthIfDisconnected();
					  });

					  current_socket.on('reconnect', function() {
					  	showGlitchyEarthIfDisconnected();
					  });

					  current_socket.on('disconnect', function() {
					  	showGlitchyEarthIfDisconnected();
					  });

					  current_socket.on('error', function() {
					  	showGlitchyEarthIfDisconnected();
					  });
					}


			    /* Watches */

			    scope.$watch('tweetData', function(new_data, old_data) {
			    	if (scene_ready && new_data) {
			    		tweets = new_data;
			    		addPoints();
			    	}
				  });

				  scope.$watch('socket', function(new_socket, _) {
			    	if (new_socket) {
			    		current_socket = new_socket;
			    		//showGlitchyEarthIfDisconnected();
			    		setSocketListeners();
			    	}
				  });


	        /* Lifecycle */

	        scope.render = function() {
	        	step += 0.1;
						tvEffect.uniforms['time'].value = step;

						// Update Camera Position
	          updateCameraPosition(step);

	          // Render
	          renderer.render(scene, camera);
	          composer.render(0.1);
 						requestAnimationFrame(scope.render);
	        };

	        scope.init();
	      }
	    }
    }]);
});
