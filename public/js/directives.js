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
		.directive('emojiPlanet', ['$rootScope', '$http', '$window', 'EarthScene', function($rootScope, $http, $window, EarthScene) {
    	return {
	      restrict: 'E',
	      scope: {
	      	'scopeReady': '=',
	        'tweetData': '=',
	        'socket': '=',
	        'sceneReady': '&onLoad'
	      },
	      link: function(scope, element, attrs) {


					(function(scope, element, attrs) {

						// TODO: URGENT: REMOVE ALL LISTENERS AND TIMEOUTS WHEN SCOPE IS TO BE DESTROYED. THIS WILL LIKELY SOLVE OUR LAG ISSUE AFTER SEVERAL ROUTING ACTIONS.
						// ALSO MAKE SURE THE PLAY FUNCTION AND STUFF OVER IN THE FACTORY ISNT MAKING THIS DRAW IN MULTIPLE CANVASES OR SOMETHING.
						var emojiPlanet = {
							init: function() {
								this.setScopeWatcher();
								this.timeout;
							},
							setScopeWatcher: function() {
								var self = this;
								scope.$watch('scopeReady', function(scope_is_ready, _) {
									if (scope_is_ready) {
										self.timeout = setTimeout(function() {
											EarthScene.init(function(){
												self.setAllWatchers();
												self.setListeners();
												scope.sceneReady();
											});
										}, 2000);
									}
								});
							},
							setAllWatchers: function() {
								// NOTE: All watchers are automatically destroyed along with the scope.
								scope.$watch('tweetData', function(new_data, old_data) {
						    	EarthScene.addPoints(new_data);
							  });

							  scope.$watch('socket', function(new_socket, _) {
							  	if (new_socket) {
							  		EarthScene.setSocket(new_socket);
							  	}
							  });
							},
							setListeners: function() {
								var self = this;
								scope.$on('$destroy', function() {
									clearTimeout(self.timeout);

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
								EarthScene.handleResize();
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
		}])
		.directive('animClass', ['$route', function($route){
		  return {
		    link: function(scope, elm, attrs){
		      var enterClass = $route.current.animate;
		      elm.addClass(enterClass);
		      scope.$on('$destroy',function(){
		        elm.removeClass(enterClass);
		        elm.addClass($route.current.animate);
		      })
		    }
		  }
		}]);
});
