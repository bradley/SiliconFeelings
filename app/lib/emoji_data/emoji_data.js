var ALL_EMOJI_MAP = require('./vendor/emoji.json'),
    TOP_EMOJI_MAP = require('./vendor/top_400_emoji.json'),
    EmojiChar     = require('./emoji_data/emoji_char')
    _             = require('underscore');

var EmojiData = function (config) {
  this.config = config || {};
  this.config.emoji_map = this.config.top_emojis ? TOP_EMOJI_MAP : ALL_EMOJI_MAP;
  this.config.emoji_chars = _.map(this.config.emoji_map, function(emoji) { return new EmojiChar(emoji) });
  this.emojis = this.emojis || (function(outerscope){ return outerscope.getEmojiChars(); })(this);
}

EmojiData.prototype = {
  getEmojiChars: function() {
    return _.map(this.config.emoji_chars, function(emoji_char) { return emoji_char.emoji; });
  },
  findByString: function(str) {
    var emoji_chars = this.emojis,
        matches;
    matches = _.filter(emoji_chars, function(emoji) { return (str.indexOf(emoji) != -1) });
    return matches;
  }
}

module.exports = EmojiData;
