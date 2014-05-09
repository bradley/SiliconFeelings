define(['angular'], function(angular) {
	'use strict';


  /* Directives */

	angular.module('myApp.directives', [])
		.directive('glitchLogo', ['$window', 'Logo', function($window, Logo) {
			return {
				restrict: 'E',
				link: function(scope, element) {


					(function(scope, element) {

						var glitchLogo = {
							init: function() {
								this.setupLogo();
							},
							setupLogo: function() {
								Logo.init();
							},
							setListeners: function() {
								var self = this;
								scope.$on('$destroy', function() {
									Logo.stop();
								});
							}
						}
						glitchLogo.init();

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
