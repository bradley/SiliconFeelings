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
  var emojiData,
      emojis;

  // Only use the 'top' 200 emoji (determined Feb 26, 2014 using http://www.emojitracker.com/)
  // if we still only have basic stream access... i.e.; if Twitter never got back to us. 😔
  if (config.twitter.max_terms) {
    emojiData = new EmojiData({top_emojis: true});
  }
  else {
    emojiData = new EmojiData();
  }
  emojis = emojiData.emojis;

  // Start streaming.
  var stream = twitter_stream.stream('statuses/filter', { track: emojis });

  stream.on('tweet', function (tweet) {
    var emojiTweet = new EmojiTweet(tweet);

    if (emojiTweet.isRetweet()) {
      return;
    }

    if (emojiTweet.coordinates && emojiTweet.emojis.length > 0 ) {
      _.each(emojiTweet.emojis, function(emoji) {
        // NOTE: The coordinates appear to be reversed from what google uses.
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
