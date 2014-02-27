// Setup ========================================================================
var Twit           = require('twit'),
    config         = require('config'),
    emoji          = require('emoji'),
    EmojiData      = require('app/lib/emoji_data/emoji_data'),
    twitter_stream;

twitter_stream = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});


// Controllers ==================================================================
function emojiStream(io) {
  var emoji_data = new EmojiData(),
      emoji = emoji_data.emoji_chars();

      console.log(emoji);

  var stream = twitter_stream.stream('statuses/filter', { track: emoji });

  stream.on('tweet', function (tweet) {
    if (tweet.coordinates) {
      console.log(tweet.coordinates.coordinates);
    }
  });
}


// Exports ======================================================================
function setup(io) {
  emojiStream(io);
}
module.exports = setup;
