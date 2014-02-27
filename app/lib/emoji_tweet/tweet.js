var EmojiData = require('app/lib/emoji_data/emoji_data'),
    _         = require('underscore');

var EmojiTweet = function (raw_tweet) {
  this.tweet = raw_tweet;
  this.coordinates = this.tweet.coordinates ? this.tweet.coordinates.coordinates : null;
  this.all_emojis = null;
}

EmojiTweet.prototype = {
  isRetweet: function() {
    this.tweet.retweeted_status == 'undefined';
  },
  emojis: function() {
    var self = this;

    this.all_emojis = this.all_emojis || (function(outerscope) {
      var emojiData = new EmojiData,
          emojis = emojiData.findByString(outerscope.tweet.text);
      return emojis;
    })(self);

    return this.all_emojis;
  }
}

module.exports = EmojiTweet;
