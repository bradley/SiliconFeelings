var EMOJI_MAP = require('./vendor/emoji.json'),
    EmojiChar = require('./emoji_data/emoji_char')
    _         = require('underscore');

var EmojiData = function () {
  this.config = {};
  this.config.EMOJI_MAP = EMOJI_MAP;
  this.config.EMOJI_CHARS = _.map(this.config.EMOJI_MAP, function(emoji) { return new EmojiChar(emoji) });
  this.chars = null;
}

EmojiData.prototype = {
  emoji_chars: function() {
    this.chars = this.chars || _.map(this.config.EMOJI_CHARS, function(emoji_char) { return emoji_char.emoji_char(); });
    return this.chars;
  }
}

module.exports = EmojiData;
