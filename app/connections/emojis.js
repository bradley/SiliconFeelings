// Setup ========================================================================
var emoji       = require('emoji'),
    EmojiStream = require('app/lib/emoji_stream/emoji_stream'),
    emojiStream = new EmojiStream(),
    io = null;

// Controllers ==================================================================
function foundTweet(emoji_tweet) {
  console.log(emoji_tweet);
}

// Exports ======================================================================
function setup(io) {
  io = io;
  emojiStream.streamTweets(foundTweet)
}
module.exports = setup;
