// Setup ========================================================================
var Twit           = require('twit'),
    config         = require('config'),
    emoji          = require('emoji'),
    EmojiTweet     = require('app/lib/emoji_tweet/tweet'),
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
  var emojiData = new EmojiData(),
      emoji = emojiData.emojiChars();

  var stream = twitter_stream.stream('statuses/filter', { track: emoji });

  stream.on('tweet', function (tweet) {
    var emojiTweet = new EmojiTweet(tweet);

    if (emojiTweet.isRetweet()) {
      return;
    }

    if (emojiTweet.coordinates && emojiTweet.emojis().length > 0 ) {
      _.each(emojiTweet.emojis(), function(emoji) {
        console.log([emoji, emojiTweet.coordinates]);
      });
    }
  });
}


// Exports ======================================================================
function setup(io) {
  emojiStream(io);
}
module.exports = setup;
