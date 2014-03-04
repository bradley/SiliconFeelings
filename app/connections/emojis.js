// Setup ========================================================================
var EmojiStream = require('app/lib/emoji_stream/stream'),
    io = null,
    new_tweets = [];


// Controllers ==================================================================
function foundTweet(tweet) {
  new_tweets.push({ emoji: tweet.emoji, coordinates: tweet.coordinates });
}


// Emission Event 'Loop' ==========================================================
// NOTE: This loop is intended to improve performance by limiting the emission of
//   tweets to clients to every tenth of a second rather than on every tweet.
function emit() {
	if (new_tweets.length) {
	  io.sockets.emit('new_tweets', new_tweets);
	  new_tweets = [];
	}
	// Call self. This is effectively a loop.
	setTimeout(emit, 100);
}


// Exports ======================================================================
function setup(io_connection) {
  var emojiStream = new EmojiStream();
  io = io_connection;

  // Tweet Stream Event Handlers
  emojiStream.streamTweets(foundTweet)

  emit();
}
module.exports = setup;
