define(['angular', 'three', 'trackballControls', 'effectComposer', 'renderPass', 'shaderPass', 'rgbShiftShader', 'badTVShader', 'tripShader'], function(angular) {
	'use strict';


  /* Directives */

	angular.module('myApp.directives', [])
		.directive('glitchLogo', ['$window', function($window) {
			return {
				restrict: 'A',
				link: function(scope, element) {


					(function(scope, element) {

						var c = element[0],
								ctx = c.getContext("2d");

						var font_size = 58,
					      first_word = 'Emoji',
					      first_font = "italic bold " + 116 + "px 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, 'Liberation Sans', 'Arimo', Arial, sans-serif",
					      second_word = 'International',
					      second_font = 40 + "px 'Minion Pro', 'Crimson Text', Minion Pro', Times, 'Times New Roman', serif",
					      gradient,
					      first_word_width,
					      second_word_width;

						var colors = new Array(
						  [118, 200, 215],
						  [93, 161, 153],
						  [80, 140, 169],
						  [107, 184, 200],
						  [114, 214, 206],
						  [115, 207, 166]);

						var step = 0,
								colorIndices = [0,1,2,3],
								gradientSpeed = 0.009;

						function updateGradient() {

							var c0_0 = colors[colorIndices[0]],
									c0_1 = colors[colorIndices[1]],
									c1_0 = colors[colorIndices[2]],
									c1_1 = colors[colorIndices[3]];

							var istep = 1 - step,
									r1 = Math.round(istep * c0_0[0] + step * c0_1[0]),
									g1 = Math.round(istep * c0_0[1] + step * c0_1[1]),
									b1 = Math.round(istep * c0_0[2] + step * c0_1[2]),
									color1 = "#"+((r1 << 16) | (g1 << 8) | b1).toString(16);

							var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]),
									g2 = Math.round(istep * c1_0[1] + step * c1_1[1]),
									b2 = Math.round(istep * c1_0[2] + step * c1_1[2]),
									color2 = "#"+((r2 << 16) | (g2 << 8) | b2).toString(16);

							updateLogoText(color1, color2);


						  step += gradientSpeed;
						  if ( step >= 1 )
						  {
						    step %= 1;
						    colorIndices[0] = colorIndices[1];
						    colorIndices[2] = colorIndices[3];

						    //pick two new target color indices
						    //do not pick the same as the current one
						    colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
						    colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;

						  }
						}

						function resizeCanvasForFonts() {
							var text_width = 0;

							ctx.font = first_font;
						  first_word_width = ctx.measureText(first_word).width;
						  ctx.font = second_font;
						  second_word_width = ctx.measureText(second_word).width;

						  text_width = Math.max(first_word_width,second_word_width);
						  if (c.width != text_width) {
						    c.width = text_width + 10;
						    c.height = 150;
						  }
						}

						function updateLogoText(color1, color2) {

						  // Reset
						  ctx.clearRect(0, 0, c.width, c.height);

						  resizeCanvasForFonts();

						  // Draw Logo Text
						  ctx.font = first_font;
						  gradient = ctx.createLinearGradient(0,0,c.width,0);
						  gradient.addColorStop("0",color1);
						  gradient.addColorStop("1.0",color2);
						  ctx.fillStyle = gradient;
						  ctx.fillText(first_word, (c.width/2) - (first_word_width / 2), 85);
						  ctx.font = second_font;
						  ctx.fillStyle = "#121924";
						  ctx.fillText(second_word, (c.width/2) - (second_word_width / 2), 145);
						}

						setInterval(updateGradient,10);

	        })(scope, element);
				}
			}
		}])
		.directive('emojiPlanet', ['$rootScope', '$http', '$window', function($rootScope, $http, $window) {
    	return {
	      restrict: 'E',
	      scope: {
	        'tweetData': '=',
	        'socket': '=',
	        'sceneReady': '&onLoad'
	      },
	      link: function(scope, element, attrs) {


					(function(scope, element, attrs) {


		      	/* Setup */

		      	// Constants
		        var width = 1000,
		        		height = 1000,
		        		pos_x = width / 2,
		        		pos_y = height / 2,
		        		pos_z = 2250,
		        		fov = 45,
				    		near = 1,
				    		far = 4000,
				    		radius = 900,
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
						var requestId,
								scene_ready = false,
								interaction_initiated = false,
								holding_earth = false;


				    /* Initialize */

		        function init() {
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
			          renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
			          renderer.setClearColor(0x000000, 0);
			          renderer.setSize(width, height);
			          // NOTE: https://github.com/mrdoob/three.js/issues/4469#issuecomment-36291287
			          renderer.context.getProgramInfoLog = function () { return '' };

			          // Build Scene Components
			          addLights();
			          addEarth();
			          addFog();

			          // NOTE: Element is provided by the angular directive
			          element.append(renderer.domElement);

			          // Postprocessing
			          addPostprocessing();

			          // Clean up
			          scope.$on('$destroy', teardown);

			          scene_ready = true;
			          scope.sceneReady();
			        	render();
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
					    	emoji_sprites_new.src = 'vendor/images/' + data.meta.image;
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
		        	var start = 1780,
		        			end = 1940;

		        	scene.fog = new THREE.Fog(0xF8F8F8, start, end);
		        }

		        function addPoints() {
	            var plane = new THREE.PlaneGeometry(67, 67),
	            		mesh = new THREE.Mesh(plane),
	           			geo = new THREE.Geometry(),
	           			materials = [];

	           	// NOTE: Rid ourselves of any tweets we cant find the emoji for. This shouldn't
	           	//   happen since we've refined our mappings, but this will prevent errors if
	           	//   we've missed anything.
	           	tweets = _.reject(tweets, function(tweet, index) {
	           		return typeof emoji_sprite_mappings[tweet.unified] === 'undefined';
	           	});

	            _.each(tweets, function(tweet, index) {
	            	// Convert earth coordinate to point in 3d space relative to our earth sphere.
		          	var lon = parseInt(tweet.coordinates[0]),
		          			lat = parseInt(tweet.coordinates[1]),
		          			unified = tweet['unified'],
		          			sprite = emoji_sprite_mappings[unified].sprite.clone(),
		          			position = lonLatToVector3(lon, lat);

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
	            	sprite.dispose();
	            });

							if (materials.length > 0) {
								var combined_material = new THREE.MeshFaceMaterial(materials);
								combined_material.needsUpdate=true;
								var total = new THREE.Mesh(geo, combined_material);

								total.matrixAutoUpdate = false;

		          	scene.add(total);

		          	// Clean up
		          	setTimeout(function() {
		          		// TODO: Rather than N timouts, let's look into having a single interval that checks for old data points
		          		// and removes them.
									scene.remove(total);
		          	}, 2000);
		          }
				    }

				    function addPostprocessing() {
								composer = new THREE.EffectComposer(renderer);

			          renderPass = new THREE.RenderPass(scene, camera);
								composer.addPass(renderPass);

								rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
								rgbEffect.uniforms['amount'].value = 0.007;
								composer.addPass(rgbEffect);

								tvEffect = new THREE.ShaderPass(THREE.BadTVShader);
								tvEffect.uniforms['distortion'].value = 1.5;
								tvEffect.uniforms['distortion2'].value = 2.1;
								tvEffect.uniforms['speed'].value = 0.07;
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
							for (var i = 0; i < faces.length; i ++) {
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
				    	composer = null;
					  	if (!current_socket.connectionStatus() && scene_ready) {
					  		composer = new THREE.EffectComposer(renderer);
								composer.addPass(renderPass);
					  		composer.addPass(rgbEffect);
					  		composer.addPass(tvEffect);
					  		composer.addPass(copyPass);
								copyPass.renderToScreen = true;
					  	}
				    }

				    function updateCameraPosition(step) {
				    	if (interaction_initiated) {
				    		if (holding_earth) {
				    			controls.update();
				    		}
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

						$(element[0]).circlemouse({
							onMouseEnter: function(event, el) {
								el.addClass('ec-circle-hover');
							},
							onMouseLeave: function(event, el) {
								el.removeClass('ec-circle-hover');
							},
							onMouseDown: function(event, el) {
								if (scene_ready) {
						    	controls = controls || new THREE.TrackballControls(camera, renderer.domElement);
						    	controls.forceMousedown(event); // Tell control about this mousedown event.
						    	interaction_initiated = true;
									holding_earth = true;
						    }
							}
						});

						$(document).bind('mouseup', function(e) {
				    	holding_earth = false;
				    });

				    angular.element($window).bind('resize', function(e) {
				    	if (controls) {
				    		controls.handleResize();
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
				    		setSocketListeners();
				    	}
					  });


		        /* Lifecycle */

		        function render() {
		        	step += 0.1;
							tvEffect.uniforms['time'].value = step;

							// Update Camera Position
		          updateCameraPosition(step);

		          // Render
		          renderer.render(scene, camera);
		          if (composer) {
		          	composer.render(0.1);
		          }
							requestId = requestAnimationFrame(render);
		        };

		        function teardown() {
		        	composer = null;
		        	cancelAnimationFrame(requestId);
       				requestId = undefined;

       				//var image = new Image();
							//image.id = "pic"
							//image.src = renderer.domElement.toDataURL();
							//$(image).width =
							//element.html('').append(image);
		        }

		        init();

	        })(scope, element, attrs);
	      }
	    }
    }])
		.directive('shareButton', ['$window', function($window) {
			return {
				restrict: 'E',
				templateUrl: 'partials/components/share-button.html',
				link: function(scope, element) {
					$('.perspective-button-container').click(function() {
			        $(this).toggleClass('active');
			        $('#share-text-container').toggleClass('active');
			    });
			    var $shareable_text = $('#share-text'),
			    		$shareable_text_input = $shareable_text.find('input');

			    $shareable_text_input.blur(function() {
			    	$shareable_text.removeClass('focused');
			    });

			    $shareable_text.click(function(e) {
			    	$shareable_text.addClass('focused');
			    	$shareable_text_input.select();
			    });
				}
			}
		}]);
});
