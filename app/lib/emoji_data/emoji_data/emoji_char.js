var punycode = require('punycode'),
		_ 			 = require('underscore');

var EmojiChar = function (emoji_hash) {
	this.config = {};
  this.config.unified = emoji_hash.unified;
  this.emoji = this.emoji || (function(outerscope){ return outerscope.getChar(); })(this);
}

EmojiChar.prototype = {
  getChar: function () {
  	var split = this.config.unified.split('-'),
        hex_emoji = _.map(split, function(i) { return parseInt(i, 16) }),
				utf8_emoji = punycode.ucs2.encode(hex_emoji);

    return utf8_emoji;
  }
}

module.exports = EmojiChar;
