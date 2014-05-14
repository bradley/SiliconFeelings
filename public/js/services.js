define(['angular', 'io', 'three', 'trackballControls', 'effectComposer', 'renderPass', 'shaderPass', 'rgbShiftShader', 'badTVShader', 'tripShader'], function(angular) {
	'use strict';


  /* Services */

	angular.module('myApp.services', [])
		.factory('Socket', ['$rootScope', function($rootScope) {
			var options = {
						'force new connection': true,
						'heartbeat timeout': 10
					},
					connection = io.connect('/', options);

		  return {
		    disconnect: function() {
		    	if (this.connectionStatus()) {
		    		connection.disconnect();
		    		window.connection = connection;
		    	}
		    },
		    reconnect: function() {
		    	this.disconnect();
		    	connection.socket.connect('/', options);
		    },
		    connectionStatus: function() {
		  		return connection.socket.connected;
		  	},
		    on: function(eventName, callback) {
		      connection.on(eventName, function() {
		        var args = arguments;
		        $rootScope.$apply(function() {
		          callback.apply(connection, args);
		        });
		      });
		    },
		    off: function(eventName, callback) {
		    	connection.removeListener(eventName, callback);
		    },
		    emit: function(eventName, data, callback) {
		      connection.emit(eventName, data, function() {
		        var args = arguments;
		        $rootScope.$apply(function() {
		          if (callback) {
		            callback.apply(connection, args);
		          }
		        });
		      })
		    },
		    getSocket: function() {
		      return connection;
		    }
		  }

		}])
		.factory('Logo', ['$rootScope', '$http', '$window', 'Socket', function($rootScope, $http, $window, Socket) {
			var Logo = Logo || {};

			Logo.LogoCanvas = function() {
				var self = this;

				this.element = null;
	    	this.requestId = null;

				this.c = null;
				this.ctx = null;

	    	this.colors = null;

				this.font_size = null;
				this.logo_text = null;
				this.font = null,

	    	this.step = null;
				this.colorIndices = null;
				this.gradientSpeed = null;

				this.init();
			}
			Logo.LogoCanvas.prototype = {
		    init: function() {

		    	this.element = null;
		    	this.requestId = null;

					this.c = document.createElement('canvas');
					this.c.width = 500;
					this.c.height = 60;
					this.ctx = this.c.getContext('2d');

		    	this.colors = new Array(
					  [92, 50, 244],
					  [92, 50, 244],
					  [92, 50, 244],
					  [92, 50, 244],
					  [92, 50, 244],
					  [84, 138, 224],
					  [92, 50, 244],
					  [91, 157, 209],
					  [92, 50, 244],
					  [109, 200, 184],
					  [92, 50, 244],
					  [128, 235, 206]
					);

					this.font_size = 48;//54;
					this.logo_text = 'SILICON FEELINGS';
					this.font = "bold " + this.font_size + "px 'Grotesque-Med', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, sans-serif",

		    	this.step = 0;
					this.colorIndices = [0,1,2,3];
					this.gradientSpeed = 0.09;

					this.timeout;
		    },
		    updateGradient: function() {

					var c0_0 = this.colors[this.colorIndices[0]],
							c0_1 = this.colors[this.colorIndices[1]],
							c1_0 = this.colors[this.colorIndices[2]],
							c1_1 = this.colors[this.colorIndices[3]];

					var istep = 1 - this.step,
							r1 = Math.round(istep * c0_0[0] + this.step * c0_1[0]),
							g1 = Math.round(istep * c0_0[1] + this.step * c0_1[1]),
							b1 = Math.round(istep * c0_0[2] + this.step * c0_1[2]),
							color1 = "#"+((r1 << 16) | (g1 << 8) | b1).toString(16);

					var r2 = Math.round(istep * c1_0[0] + this.step * c1_1[0]),
							g2 = Math.round(istep * c1_0[1] + this.step * c1_1[1]),
							b2 = Math.round(istep * c1_0[2] + this.step * c1_1[2]),
							color2 = "#"+((r2 << 16) | (g2 << 8) | b2).toString(16);

					this.updateLogoText(color1, color2);

				  this.step += this.gradientSpeed;
				  if ( this.step >= 1 )
				  {
				    this.step %= 1;
				    this.colorIndices[0] = this.colorIndices[1];
				    this.colorIndices[2] = this.colorIndices[3];

				    //pick two new target color indices
				    //do not pick the same as the current one
				    this.colorIndices[1] = (this.colorIndices[1] + Math.floor(1 + Math.random() * (this.colors.length - 1))) % this.colors.length;
				    this.colorIndices[3] = (this.colorIndices[3] + Math.floor(1 + Math.random() * (this.colors.length - 1))) % this.colors.length;

				  }
				},
				updateLogoText: function(color1, color2) {
					var gradient;

				  // Reset
				  this.ctx.clearRect(0, 0, this.c.width, this.c.height);

				  // Draw Logo Text
				  this.ctx.font = this.font;
				  gradient = this.ctx.createLinearGradient(0,0,this.c.width,0);
				  gradient.addColorStop("0",color1);
				  gradient.addColorStop("1.0",color2);
				  this.ctx.fillStyle = gradient;
				  this.ctx.fillText(this.logo_text, 0, 47);

				  this.render();
				},
		  	play: function() {
   				this.element = $('#logo-container');
          this.element.append(this.c);
          this.render();
   			},
   			stop: function() {
   				if (this.timeout) {
						clearTimeout(this.timeout);
					}
   			},
   			render: function() {
   				var self = this;
					if (this.timeout) {
						clearTimeout(this.timeout);
					}
					this.timeout = setTimeout(function() {
						self.updateGradient();
					}, 100);
   			}
		  }

		  var logoCanvas;

		  var sharedCanvas = {
		  	init: function() {
		  		if (logoCanvas) {
		  			logoCanvas.play();
		  		}
		  		else {
						logoCanvas = new Logo.LogoCanvas();
						logoCanvas.play();
		  		}
		  	},
		  	stop: function() {
		  		logoCanvas.stop();
		  	}
		  }

		  var canvas = {
		  	init: sharedCanvas.init,
		  	stop: sharedCanvas.stop
		  }

		  return canvas;

		}])
		.factory('EarthScene', ['$rootScope', '$http', '$window', 'Socket', function($rootScope, $http, $window, Socket) {
			var EarthScene = EarthScene || {};

			EarthScene.Scene = function(progress_callback, completion_callback) {

				// Setup
	    	var self = this;
	    	this.element;

	    	// Constants
        this.width = 1000;
        this.height = 1000;
        this.pos_x = this.width / 2;
        this.pos_y = this.height / 2;
        this.pos_z = 2250;
        this.fov = 45;
		    this.near = 1;
		    this.far = 4000;
		    this.radius = 900;
		    this.center_of_scene = null;

		    // Scene Components
				this.camera = null;
				this.scene = null;
				this.renderer = null;
				this.composer = null;
				this.controls = null;
				this.light = null;
				this.earth = null;

	    	// Earth Components
				this.planet_texture = null;
				this.planet_specular_texture = null;

	    	// Emoji Components
	    	this.emoji_sprites_new = null;
				this.emoji_sprites = null;
				this.emoji_sprite_mappings = null;
				this.emoji_sprite_sheet_width;
				this.emoji_sprite_sheet_height;

				// Postprocessing Components
				this.rgbEffect = null;
				this.tvEffect = null;
				this.copyPass = null;
				this.renderPass = null;
				this.step = 0;

				// Etc
	    	this.requestId = null;
				this.scene_ready = false;
				this.interaction_initiated = false;
				this.holding_earth = false;
				this.allow_emoji = false;

				this.init(progress_callback, completion_callback);
			};
		  EarthScene.Scene.prototype = {
		    init: function(progress_callback, completion_callback) {

		    	// Setup
		    	var self = this;
		    	this.progress_callback = progress_callback;
		    	this.completion_callback = completion_callback;
		    	this.element;

		    	// Constants
	        this.width = 1000;
	        this.height = 1000;
	        this.pos_x = this.width / 2;
	        this.pos_y = this.height / 2;
	        this.pos_z = 2250;
	        this.fov = 45;
			    this.near = 1;
			    this.far = 4000;
			    this.radius = 900;
			    this.center_of_scene = new THREE.Vector3(0,0,0);

			    // Scene Components
					this.camera;
					this.scene;
					this.renderer;
					this.composer;
					this.controls;
					this.light;
					this.earth;

		    	// Earth Components
					this.planet_texture;
					this.planet_specular_texture;

		    	// Emoji Components
		    	this.emoji_sprites_new = new Image();
					this.emoji_sprites;
					this.emoji_sprite_mappings;
					this.emoji_sprite_sheet_width;
					this.emoji_sprite_sheet_height;

					// Postprocessing Components
					this.rgbEffect;
					this.tvEffect;
					this.copyPass;
					this.renderPass;
					this.step = 0;

					// Etc
		    	this.requestId;
					this.scene_ready = false;
					this.interaction_initiated = false;
					this.holding_earth = false;
					this.allow_emoji = false;

		    	this.loadResources();
		    },
		    loadResources: function() {
		    	// Loads all resources.
		    	var self = this;

        	var load_functions = [],
        			emoji_data,
        			loadSpriteSheetMappings,
        			loadSpriteSheetImage,
        			mapEmojiTextures,
        			loadPlanetTexture,
        			loadPlanetSpecularTexture;


			  	loadSpriteSheetMappings = function(promise) {
			  		$http.get('vendor/emoji_sprite_sheet_small.json').success(function(data) {
			  			emoji_data = data;
			  			self.emoji_sprite_mappings = emoji_data.frames;
			    		self.emoji_sprite_sheet_width = emoji_data.meta.size.w;
			    		self.emoji_sprite_sheet_height = emoji_data.meta.size.h;

			    		promise();
			  		});
			  	}
			  	load_functions.push(loadSpriteSheetMappings);

			  	loadSpriteSheetImage = function(promise) {
			  		self.emoji_sprites_new.onload = function() {
			  			promise();
			  		};
			  		// Set src for image so that the onload event is triggered.
			    	self.emoji_sprites_new.src = 'vendor/images/' + emoji_data.meta.image;
			  	}
			  	load_functions.push(loadSpriteSheetImage);

			  	mapEmojiTextures = function(promise) {
			  		self.mapEmojiTextures(function() {
			  			promise();
			  		});
			  	}
			  	load_functions.push(mapEmojiTextures);

			  	loadPlanetTexture = function(promise) {
			  		self.planet_texture = THREE.ImageUtils.loadTexture("vendor/images/earth.jpg", {}, function() {
			  			promise();
			  		});
			  	}
			  	load_functions.push(loadPlanetTexture);

			  	loadPlanetSpecularTexture = function(promise) {
			  		self.planet_specular_texture = THREE.ImageUtils.loadTexture("vendor/images/specular.png", {}, function() {
			  			promise();
			  		});
			  	}
			  	load_functions.push(loadPlanetSpecularTexture);


			  	function loadResourceFunctionAtIndex(index, promise) {
			  		load_functions[index](function() {
			  			self.progress_callback((index + 1) / (load_functions.length));
			  			if ((index + 1) <= (load_functions.length - 1)) {
			  				loadResourceFunctionAtIndex(index + 1, promise);
			  				return;
			  			}
			  			promise();
			  		});
			  	}

			  	loadResourceFunctionAtIndex(0, function() {
			  		setTimeout(function() {
			  			$rootScope.earthResourcesLoaded = true;
			  			self.setupScene();
			  		},500);
			  	});
		    },
		    setupScene: function() {
		    	// Camera
          this.camera = new THREE.PerspectiveCamera(this.fov, (this.width / this.height), this.near, this.far);
			    this.camera.position.set(this.pos_x, this.pos_y, this.pos_z);
			    this.camera.lookAt(this.center_of_scene);

          // Scene
          this.scene = new THREE.Scene();
          this.scene.add(this.camera);

         	// Renderer
          this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
          this.renderer.setClearColor(0x000000, 0);
          this.renderer.setSize(this.width, this.height);
          // NOTE: https://github.com/mrdoob/three.js/issues/4469#issuecomment-36291287
          this.renderer.context.getProgramInfoLog = function () { return '' };
          // Build Scene Components
          this.addLights();
          this.addEarth();
          this.addFog();
          this.addPostprocessing();

          this.setSocketListeners();

          this.scene_ready = true;
          if (typeof this.completion_callback == 'function') {
          	this.completion_callback();
          }
		    },
		    isSceneReady: function() {
		    	return this.scene_ready;
		    },
		    mapEmojiTextures: function(callback) {
		    	// Creates a reusable material for each emoji using our spritesheet, and updates emoji sprite sheet json mapper.
		    	for(var key in this.emoji_sprite_mappings) {
						var sprite_info = this.emoji_sprite_mappings[key],
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
							this.emoji_sprites_new,   // Image
							sprite_frame.x,           // The x coordinate where to start clipping.
							sprite_frame.y,           // The y coordinate where to start clipping
							sprite_frame.w,           // The width of the clipped image.
							sprite_frame.h,           // The height of the clipped image.
							0,                        // The x coordinate where to place the image on the canvas.
							0,                        // The y coordinate where to place the image on the canvas.
							sprite_frame.w,           // The width of the image to use (stretch or reduce the image).
							sprite_frame.h            // The height of the image to use (stretch or reduce the image)
						);

						texture.needsUpdate = true;

						material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });

						sprite_info.sprite = material;
					}
					callback();
		    },
		    addLights: function() {
		    	var main_light = this.light = new THREE.DirectionalLight(0xffffff, 0.4),
        			spot_light = new THREE.SpotLight(0xD4E1C0, 1.25),
        			ambient_light = new THREE.AmbientLight(0x29305E),
        			backlight = new THREE.DirectionalLight(0x29195C, 0.8);

        	this.scene.add(ambient_light);

          // NOTE: We are adding the light to our camera and not the scene.
          //  Our trackball control (camera rotating functionality) rotates the
          //  camera so if we need a fixed light it must be part of the camera and
          //  not the scene. Our positioning is also relative to the camera.
          this.camera.add(main_light);
          main_light.position.set(-1800, 1800, 780);

    			// Additional glow on top left of Earth.
    			this.camera.add(spot_light);
          spot_light.position.set(-900, 1800, 780);
          spot_light.exponent = 70.0;

          // Just a hint of dark light at the bottom right of Earth.
          this.camera.add(backlight);
          backlight.position.set(2400, -2400, -3000);
		    },
		    addEarth: function() {
		    	var sphere = new THREE.SphereGeometry(this.radius, 50, 50),
							material = new THREE.MeshPhongMaterial({
								map: this.planet_texture,
								shininess: 0.1
          		});

					material.specularMap = this.planet_specular_texture;
					material.specular = new THREE.Color('white');
					this.earth = new THREE.Mesh(sphere, material);

		      this.scene.add(this.earth);
		    },
		    addFog: function() {
					var start = 1780,
        			end = 1940;

        	this.scene.fog = new THREE.Fog(0xEAE4DD, start, end);
		    },
		    addPostprocessing: function() {
		    	this.composer = new THREE.EffectComposer(this.renderer);

          this.renderPass = new THREE.RenderPass(this.scene, this.camera);
					this.composer.addPass(this.renderPass);

					this.rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
					this.rgbEffect.uniforms['amount'].value = 0.007;
					this.composer.addPass(this.rgbEffect);

					this.tvEffect = new THREE.ShaderPass(THREE.BadTVShader);
					this.tvEffect.uniforms['distortion'].value = 2.0;
					this.tvEffect.uniforms['distortion2'].value = 2.1;
					this.tvEffect.uniforms['speed'].value = 0.09;
					this.tvEffect.uniforms['rollSpeed'].value = 0.0;
					this.composer.addPass(this.tvEffect);

					this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
					this.composer.addPass(this.copyPass);

					this.copyPass.renderToScreen = true;
		    },
		    setSocketListeners: function(should_set) {
		    	var self = this;
		    	var socketConnectionListener = function() {
		    		self.showGlitchyEarthIfDisconnected();
		    	}
	    		Socket.on('connect', socketConnectionListener);
				  Socket.on('reconnect', socketConnectionListener);
				  Socket.on('disconnect', socketConnectionListener);
				  Socket.on('error', socketConnectionListener);
		    },
		    addPoints: function(tweets) {
		    	var self = this;
		    	if (this.scene_ready && tweets && this.allow_emoji) {
		    		var plane = new THREE.PlaneGeometry(67, 67),
            		mesh = new THREE.Mesh(plane),
           			geo = new THREE.Geometry(),
           			materials = [];

           	// NOTE: Rid ourselves of any tweets we cant find the emoji for. This shouldn't
           	//   happen since we've refined our mappings, but this will prevent errors if
           	//   we've missed anything.
           	tweets = _.reject(tweets, function(tweet, index) {
           		return typeof self.emoji_sprite_mappings[tweet.u] === 'undefined';
           	});

            _.each(tweets, function(tweet, index) {
            	// Convert earth coordinate to point in 3d space relative to our earth sphere.
	          	var lon = parseInt(tweet.c[0]),
	          			lat = parseInt(tweet.c[1]),
	          			unified = tweet['u'],
	          			sprite = self.emoji_sprite_mappings[unified].sprite.clone(),
	          			position = self.lonLatToVector3(lon, lat);

          		// NOTE: Prepare for merger with geo object.
          		//   http://learningthreejs.com/blog/2011/10/05/performance-merging-geometry/
          		materials.push(sprite);
          		mesh.geometry.faces = self.setFaceIndexes(mesh.geometry.faces, index);

	          	// Make plane visible on top and bottom.
	          	mesh.material.side = THREE.DoubleSide; // TODO: make sure this isnt a problem with emoji textures.
	          	// Position mesh on correct coordinate relative to the Earth in 3D space.
            	mesh.position = position;
            	// Tell mesh to look away from the center of the scene (the center of the Earth sphere).
            	self.lookAwayFromCenter(mesh);

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

	          	this.scene.add(total);

	          	// Clean up
	          	setTimeout(function() {
	          		// TODO: Rather than N timouts, let's look into having a single interval that checks for old data points
	          		// and removes them.
								self.scene.remove(total);
	          	}, 2000);
	          }
		    	}
		    },
		    setFaceIndexes: function(faces, index) {
		    	// NOTE: This make it possible to change the material Index manually.
      		//   This is especcially handy when you start to merge generated geometries with different materials.
      		//	 More: https://github.com/mrdoob/three.js/pull/2817 (since removed: https://github.com/mrdoob/three.js/releases/tag/r60)
					for (var i = 0; i < faces.length; i ++) {
						faces[i].materialIndex = index;
	 				}
	 				return faces;
   			},
   			lookAwayFromCenter: function(object) {
   				var v = new THREE.Vector3();
			    v.subVectors(object.position, this.center_of_scene).add(object.position);
			    object.lookAt(v);
   			},
   			lonLatToVector3: function(lon, lat) {
   				// Convert a lon/lat to a point on our Earth sphere.
   				var distance_from_surface = 20,
	        		phi = (lat) * Math.PI / 180,
	        		theta = (lon - 180) * Math.PI / 180,
	        		x = -(this.radius + distance_from_surface) * Math.cos(phi) * Math.cos(theta),
	        		y = (this.radius + distance_from_surface) * Math.sin(phi),
	        		z = (this.radius + distance_from_surface) * Math.cos(phi) * Math.sin(theta);

	        return new THREE.Vector3(x, y, z);
   			},
   			showGlitchyEarthIfDisconnected: function() {
   				this.composer = null;
			  	if ((!Socket.connectionStatus() || !this.allow_emoji) && this.scene_ready) {
			  		this.composer = new THREE.EffectComposer(this.renderer);
						this.composer.addPass(this.renderPass);
			  		this.composer.addPass(this.rgbEffect);
			  		this.composer.addPass(this.tvEffect);
			  		this.composer.addPass(this.copyPass);
						this.copyPass.renderToScreen = true;
			  	}
   			},
   			updateCameraPosition: function() {
   				if (this.interaction_initiated) {
		    		if (this.holding_earth) {
		    			this.controls.update();
		    		}
		    		return;
		    	}
		    	// Rotate earth if interaction is not enabled.
		    	var degree = this.step * (Math.PI / 180);
					this.camera.position.x = this.pos_x * Math.cos(degree) - this.pos_z * Math.sin(degree);
          this.camera.position.y = (this.pos_y);
          this.camera.position.z = this.pos_z * Math.cos(degree) + this.pos_x * Math.sin(degree);
          this.camera.lookAt(this.center_of_scene);
   			},
   			handleResize: function() {
   				if (this.controls) {
   					this.controls.handleResize();
   				}
   			},
   			isHoldingEarth: function(is_holding, event) {
   				if (is_holding) {
   					if (this.scene_ready) {
   						this.controls = this.controls || new THREE.TrackballControls(this.camera, this.renderer.domElement);
				    	this.controls.forceMousedown(event); // Tell control about this mousedown event.
				    	this.interaction_initiated = true;
							this.holding_earth = true;
   					}
   					return;
   				}
   				this.holding_earth = false;
   			},
   			allowEmoji: function() {
   				this.allow_emoji = true;
   				this.showGlitchyEarthIfDisconnected();
   			},
   			play: function(callback) {
   				if (this.element) {
   					this.renderer.domElement.remove();
   					this.element = null
   				}

   				this.element = $('#emoji-planet-container');
          this.element.append(this.renderer.domElement);
          this.render();
          this.showGlitchyEarthIfDisconnected();
          var self = this;
          setTimeout(function() {
          	$(self.renderer.domElement).addClass('active');
          }, 100);
          if (typeof callback == 'function') {
          	callback();
          }
   			},
   			stop: function() {
   				if (this.requestId) {
			       cancelAnimationFrame(this.requestId);
			       this.requestId = undefined;
			    }
			    this.allow_emoji = false;
			    $(this.renderer.domElement).removeClass('active');
   			},
   			render: function() {
   				var self = this;
   				this.step += 0.1;
					this.tvEffect.uniforms['time'].value = this.step;

					// Update Camera Position
          this.updateCameraPosition(this.step);

          // Render
          this.renderer.render(this.scene, this.camera);
          if (this.composer) {
          	this.composer.render(0.1);
          }
					this.requestId = requestAnimationFrame(function(){
						self.render();
					});
   			}
		  }

		  var earthScene;

		  var sharedScene = {
		  	init: function(progress_callback, completion_callback) {
		  		if (earthScene && earthScene.isSceneReady()) {
		  			earthScene.play(function() {
			  			setTimeout(function() {
								completion_callback();
							}, 100);
			  		});
		  		}
		  		else {
						earthScene = new EarthScene.Scene(function(progress) {
							progress_callback(progress);
						}, function() {
		  				earthScene.play(function() {
				  			completion_callback();
				  		});
		  			});
		  		}
		  	},
		  	stop: function() {
		  		earthScene.stop();
		  	},
		  	addPoints: function(tweets) {
		  		earthScene.addPoints(tweets);
		  	},
		  	allowEmoji: function() {
		  		earthScene.allowEmoji();
		  	},
		  	handleResize: function() {
		  		earthScene.handleResize();
		  	},
		  	isHoldingEarth: function(is_holding, event) {
		  		earthScene.isHoldingEarth(is_holding, event);
		  	}
		  }

		  var scene = {
		  	init: sharedScene.init,
		  	stop: sharedScene.stop,
		  	addPoints: sharedScene.addPoints,
		  	allowEmoji: sharedScene.allowEmoji,
		  	handleResize: sharedScene.handleResize,
		  	isHoldingEarth: sharedScene.isHoldingEarth
		  }

		  return scene;

		}]);
});
