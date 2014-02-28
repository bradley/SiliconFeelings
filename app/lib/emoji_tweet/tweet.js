var EmojiData = require('app/lib/emoji_data/emoji_data'),
    _         = require('underscore');

var EmojiTweet = function (raw_tweet) {
  this.tweet = raw_tweet;
  this.coordinates = this.tweet.coordinates ? this.tweet.coordinates.coordinates : null;
  this.emojis = this.emojis || (function(outerscope){ return outerscope.findEmojis(); })(this);
}

EmojiTweet.prototype = {
  isRetweet: function() {
    this.tweet.retweeted_status != 'undefined';
  },
  findEmojis: function() {
    var emojiData = new EmojiData(),
        emojis = emojiData.findByString(this.tweet.text);
    return emojis;
  }
}

module.exports = EmojiTweet;
