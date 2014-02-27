var punycode = require('punycode'),
		_ 			 = require('underscore');

var EmojiChar = function (emoji_hash) {
	this.config = {};
  this.config.unified = emoji_hash.unified;
  this.config.emoji_char = null;
}

EmojiChar.prototype = {
  emoji_char: function () {

  	var self = this,
  			split = this.config.unified.split('-');
    this.config.emoji_char = this.config.emoji_char || (function(outerscope) {
			var hex_emoji = _.map(split, function(i) { return parseInt(i, 16) }),
					utf8_emoji = punycode.ucs2.encode(hex_emoji);

    	return utf8_emoji;
    }(self));

    return this.config.emoji_char;
  }
}

module.exports = EmojiChar;
