define(['emoji'], function(emoji) {
	return ['$scope', '$sce', '$rootScope', '$http', '$location', 'socket', function($scope, $sce, $rootScope, $http, $location, socket) {


	  /* Setup */

	  $scope.tweet_data;
	  $scope.canvas_width = 1000;
    $scope.canvas_height = 600;


	  /* Socket Listeners */

	  socket.on('init', function(data) {
	    console.log(data.message);
	  });

	  socket.on('new_tweets', function(tweets) {
	  	$scope.tweet_data = tweets;
	  	_.each(tweets, function(tweet) {
	  		// Could get an HTML version of our tweets with emoji.unifiedToHTML(tweet.emoji);
	  	});
	  });


	  // Because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
	  $scope.$apply();
	}];
});
