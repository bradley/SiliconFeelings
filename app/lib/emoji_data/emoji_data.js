var EMOJI_MAP = require('./vendor/top_400_emoji.json'),
    EmojiChar = require('./emoji_data/emoji_char')
    _         = require('underscore');

var EmojiData = function () {
  this.config = {};
  this.config.EMOJI_MAP = EMOJI_MAP;
  this.config.EMOJI_CHARS = _.map(this.config.EMOJI_MAP, function(emoji) { return new EmojiChar(emoji) });
  this.chars = null;
}

EmojiData.prototype = {
  emojiChars: function() {
    this.chars = this.chars || _.map(this.config.EMOJI_CHARS, function(emoji_char) { return emoji_char.emoji_char(); });
    return this.chars;
  },
  findByString: function(str) {
    var emoji_chars = this.emojiChars(),
        matches;
    matches = _.filter(emoji_chars, function(emoji) { return (str.indexOf(emoji) != -1) });
    return matches;
  }
}

module.exports = EmojiData;
