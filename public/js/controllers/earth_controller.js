define(['emoji'], function(emoji) {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'socket', function($scope, $sce, $rootScope, $http, $location, socket) {

	  /* Setup */

	  $scope.emoji_data;
	  $scope.canvasWidth = 400;
    $scope.canvasHeight = 400;
    $scope.fillcontainer = true;
    $scope.scale = 1;
    $scope.materialType = 'lambert';


	  /* Socket Listeners */

	  socket.on('init', function(data) {
	    console.log(data.message);
	  });

	  socket.on('new_tweet', function(tweet) {
	    $scope.emoji_data = emoji.unifiedToHTML(tweet.emoji);
	  });

	  // http://docs.angularjs.org/api/ngSanitize/service/$sanitize
	  $scope.deliberatelyTrustDangerousSnippet = function() {
      return $sce.trustAsHtml($scope.emoji_data);
    };

	  // Because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
