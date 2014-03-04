var Twit           = require('twit'),
    config         = require('config'),
    EmojiTweet     = require('app/lib/emoji_tweet/tweet'),
    EmojiData      = require('app/lib/emoji_data/emoji_data'),
    twitter_stream;

twitter_stream = new Twit({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token,
  access_token_secret: config.twitter.access_token_secret
});

var EmojiStream = function() {
  this.twitter = twitter_stream;
  this.stream = null;
}

EmojiStream.prototype = {
  streamTweets: function(callback) {
    var stream,
        emojiData,
        emojis;

    // Only use the 'top' 200 emoji (determined Feb 26, 2014 using http://www.emojitracker.com/)
    // if we still only have basic stream access... i.e.; if Twitter never got back to us. 😔
    emojiData = new EmojiData({ top_emojis: config.twitter.has_basic_access });
    emojis = emojiData.emojis;

    // Start streaming.
    this.stream = stream = twitter_stream.stream('statuses/filter', { track: emojis });

    stream.on('tweet', function(tweet) {
      var emojiTweet = new EmojiTweet(tweet, emojiData);

      if (emojiTweet.isRetweet()) {
        return;
      }

      if (emojiTweet.coordinates && emojiTweet.emojis.length > 0 ) {
        _.each(emojiTweet.emojis, function(emoji) {
          if (typeof(callback) == typeof(Function)) {
            callback({
              "emoji": emoji,
              "unified": emojiData.emoji_mappings[emoji],
              "coordinates": emojiTweet.coordinates
            });
          }
        });
      }
    });
  }
}

module.exports = EmojiStream;
