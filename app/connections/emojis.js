// Setup ========================================================================
var EmojiStream = require('app/lib/emoji_stream/stream'),
    io = null;


// Controllers ==================================================================
function foundTweet(tweet) {
  io.sockets.emit('new_tweet', {
    emoji: tweet.emoji,
    coordinates: tweet.coordinates
  });
}


// Exports ======================================================================
function setup(io_connection) {
  var emojiStream = new EmojiStream();
  io = io_connection;

  // Tweet Stream Event Handlers
  emojiStream.streamTweets(foundTweet)
}
module.exports = setup;
