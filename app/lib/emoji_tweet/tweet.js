var EmojiData = require('app/lib/emoji_data/emoji_data'),
    _         = require('underscore');

var EmojiTweet = function(raw_tweet, emojiData) {
  this.config = {};
  this.config.emojiData = emojiData;
  this.tweet = raw_tweet;
  this.coordinates = this.tweet.coordinates ? this.tweet.coordinates.coordinates : null;
  if (!this.coordinates && this.tweet.place) {
    this.coordinates = this.tweet.place.bounding_box.coordinates[0][0];
  }
  this.emojis = this.emojis || this.findEmojis();
}

EmojiTweet.prototype = {
  isRetweet: function() {
    this.tweet.retweeted_status != 'undefined';
  },
  findEmojis: function() {
    var emojiData = this.config.emojiData || new EmojiData(),
        emojis = emojiData.findByString(this.tweet.text);
    return emojis;
  }
}

module.exports = EmojiTweet;
