define(['angular'], function(angular) {
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
					      first_word = 'silicons',
					      second_word = 'Silicon',
					      font = 91 + "px 'Crimson Text', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, 'Liberation Sans', 'Arimo', Arial, sans-serif",
					      gradient;

						var colors = new Array(
						  [254, 197, 228],
						  [141, 250, 254],
						  [250, 250, 250],
						  [180, 228, 179],
						  [196, 172, 253],
						  [250, 250, 250]);

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

						function updateLogoText(color1, color2) {

						  // Reset
						  ctx.clearRect(0, 0, c.width, c.height);

						 // resizeCanvasForFonts();

						  // Draw Logo Text
						  ctx.font = font;
						  gradient = ctx.createLinearGradient(0,0,c.width,0);
						  gradient.addColorStop("0",color1);
						  gradient.addColorStop("1.0",color2);
						  ctx.fillStyle = 'black';
						  ctx.fillText(first_word, 0, 65);

/*
						  var split_first_word = first_word.split(''),
						  		step_distance_x = [65, 65, 65, 75, 95, 95, 95],
						  		step_distance_y = [40, 40, 40, 50, 60, 60, 60],
						  		x_pos = -10, y_pos = 0;

						  for (var i = 0; i < split_first_word.length; i++) {
						  	var character = split_first_word[i];
						  	ctx.save();
								ctx.translate(50, 90);
								ctx.rotate(-Math.PI/0.5505);
								ctx.textAlign = "center";
								ctx.fillText(character, x_pos, y_pos);
								x_pos += step_distance_x[i];
								y_pos -= step_distance_y[i];
								ctx.restore();
						  }

						  var split_first_word = second_word.split(''),
						  		step_distance_x = [85, 85, 90, 65, 75, 95, 95, 95],
						  		step_distance_y = [53, 53, 53, 40, 50, 60, 60, 60],
						  		x_pos = 56, y_pos = 122 + 0;

						  for (var i = 0; i < split_first_word.length; i++) {
						  	var character = split_first_word[i];
						  	ctx.save();
								ctx.translate(50, 90);
								ctx.rotate(-Math.PI/0.5505);
								ctx.textAlign = "center";
								ctx.fillText(character, x_pos, y_pos);
								x_pos += step_distance_x[i];
								y_pos -= step_distance_y[i];
								ctx.restore();
						  }*/

						}

						setInterval(updateGradient,10);

	        })(scope, element);
				}
			}
		}])
		.directive('loadingIndicator', [function() {
			return {
				restrict: 'E',
				scope: {
					'visible': '=',
					'progress': '='
				},
				templateUrl: 'partials/components/loading_indicator.html',
				link: function(scope, element) {
					(function(scope, element) {
						var loadingIndicator = {
							init: function(){
		            this.$loader = $('#load-progress-bar');
		            this.$overlay;
		            this.loader_width = this.$loader.width();

		            this.setComponents();
		            this.setAllWatchers();
			        },
			        setComponents: function() {
		            this.$overlay = $("<div class='loading-overlay'></div>");
		            this.$overlay.width(this.loader_width);

		            this.$loader.append(this.$overlay);
		        	},
		        	setAllWatchers: function() {
		        		var self = this;
		        		// NOTE: All watchers are automatically destroyed along with the scope.
								scope.$watch('visible', function(new_data, old_data) {
									self.makeVisible(new_data);
							  });
							  scope.$watch('progress', function(new_data, old_data) {
							  	if (new_data) {
							  		self.setProgress(new_data);
							  	}
							  });
		        	},
			        setProgress: function(progress) {
		            if (typeof progress === 'number' && progress >= 0 && progress <= 1) {
	                var remaining = this.loader_width - (this.loader_width * progress);
	                this.$overlay.width(remaining);
		            }
		            else {
	                console.log('Progress sent to the setProgress() method must be a number between 0 and 1');
		            }
			        },
			        makeVisible: function(make_visible) {
			        	if (make_visible) {
			        		this.$loader.css('opacity', 1.0);
			        	}
			        	else {
			        		this.$loader.css('opacity', 0.0);
			        	}
			        }
						}

						loadingIndicator.init();
					})(scope, element);
				}
			}
		}])
		.directive('emojiPlanet', ['$rootScope', '$http', '$window', '$timeout', 'EarthScene', function($rootScope, $http, $window, $timeout, EarthScene) {
    	return {
	      restrict: 'E',
	      scope: {
	        'tweetData': '=',
	        'allowEmoji': '=',
	        'loadProgress': '&loadProgress',
	        'sceneReady': '&onLoad'
	      },
	      link: function(scope, element, attrs) {


					(function(scope, element, attrs) {
						var scene_ready_timeout,
								resize_timer;

						var emojiPlanet = {
							init: function() {
								this.prepareScene();
							},
							prepareScene: function() {
								var self = this;
								// NOTE: Setting this function to a var allows us to cancel our timeout if necessary.
								var setSceneReady = function() {
									EarthScene.init(function(progress) {
										scope.loadProgress({progress: progress});
									},
									function(){
										self.setAllWatchers();
										self.setListeners();
										scope.sceneReady();
									});
								}

								scope.$on('$destroy', function() { if (scene_ready_timeout) { $timeout.cancel(scene_ready_timeout); }});
								scene_ready_timeout = $timeout(setSceneReady, ($rootScope.page_view_count > 1 ? 800 : 0)); // Allow time for route transitions unless this is the first load.
							},
							setAllWatchers: function() {
								// NOTE: All watchers are automatically destroyed along with the scope.
								scope.$watch('tweetData', function(new_data, old_data) {
						    	EarthScene.addPoints(new_data);
							  });
							  scope.$watch('allowEmoji', function(new_data, old_data) {
							  	if (new_data) {
							  		EarthScene.allowEmoji();
							  	}
							  });
							},
							setListeners: function() {
								var self = this;
								scope.$on('$destroy', function() {
									EarthScene.stop();

									$(element[0]).circlemouse({
										onMouseEnter: function(event, el) {
											return false;
										},
										onMouseLeave: function(event, el) {
											return false;
										},
										onMouseDown: function(event, el) {
									    return false;
										}
									});

									$(document).unbind('mouseup', self.isNotHoldingEarth);

									angular.element($window).unbind('resize', self.handleResize);
									$timeout.cancel(resize_timer);
								});

								$(element[0]).circlemouse({
									onMouseEnter: function(event, el) {
										el.addClass('ec-circle-hover');
									},
									onMouseLeave: function(event, el) {
										el.removeClass('ec-circle-hover');
									},
									onMouseDown: function(event, el) {
								    self.isHoldingEarth();
									}
								});

								$(document).bind('mouseup', this.isNotHoldingEarth);

						    angular.element($window).bind('resize', this.handleResize);
							},
							handleResize: function() {
								$timeout.cancel(resize_timer);
								resize_timer = $timeout(function() {
									EarthScene.handleResize();
								}, 50);
							},
							isNotHoldingEarth: function() {
								EarthScene.isHoldingEarth(false);
							},
							isHoldingEarth: function() {
								EarthScene.isHoldingEarth(true);
							}

						}

						emojiPlanet.init();

	        })(scope, element, attrs);
	      }
	    }
    }])
		.directive('animClass', ['$rootScope', '$route', function($rootScope, $route){
		  return {
		    link: function(scope, elm, attrs){
		    	// This function applies a route specific class to the main view area so we can have different animations between views.
		    	var enter_class = $route.current.animate;

		    	// NOTE: This isn't ideally encapsulated, but this tracking page views per visit
		    	// in rootScope allows us to prevent some of our transition animations on the first load
		    	// by applying an animation preventing class.
					$rootScope.page_view_count += 1;
					if ($rootScope.page_view_count <= 1) {
						elm.addClass('prevent-scoped-animation');
						scope.$on('$routeChangeStart', function(event) {
							elm.removeClass('prevent-scoped-animation');
						});
					}

					elm.addClass(enter_class);

					scope.$on('$destroy', function() {
		        elm.removeClass(enter_class);
		        elm.addClass($route.current.animate);
		      });
		    }
		  }
		}]);
});
