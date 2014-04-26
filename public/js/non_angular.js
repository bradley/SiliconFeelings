var Application = {};

Application.shareButton = {
	init: function() {
		this.$perspective_button_container = $('.perspective-button-container');
		this.$shareable_text_container = $('#share-text-container');
		this.$shareable_text = $('#share-text');
		this.$shareable_text_input = this.$shareable_text.find('input');

		this.setupListeners();
	},
	setupListeners: function() {
		var self = this;

		this.$perspective_button_container.bind('click', function() { self.toggleShareable(); });
		this.$shareable_text_input.blur(function() { self.shouldFocusOnShareableText(false) });
		this.$shareable_text.click(function() { self.selectShareableText(); });
	},
	toggleShareable: function() {
		this.$perspective_button_container.toggleClass('active');
		this.$shareable_text_container.toggleClass('active');
	},
	shouldFocusOnShareableText: function(should_focus) {
		if (should_focus) {
			this.$shareable_text.addClass('focused');
			return;
		}
		this.$shareable_text.removeClass('focused');
	},
	selectShareableText: function() {
		this.shouldFocusOnShareableText(true);
		this.$shareable_text_input.select();
	}

}

Application.shareButton.init();