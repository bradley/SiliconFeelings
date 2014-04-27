var Application = {};

Application.layout = {
	init: function() {
		this.$view_frame;
		this.$angular_view_wrap;
		this.$grid_main;
		this.resize_timer;

		this.setupListeners();
		this.waitForSceneAndSetup();
	},
	waitForSceneAndSetup: function() {
		var self = this;
		setTimeout(function() {
			self.$angular_view_wrap = $('#animation-wrap > #main');
			if (typeof self.$angular_view_wrap == 'undefined' || self.$angular_view_wrap.outerHeight() <= 80) {
				self.waitForSceneAndSetup();
				return;
			}
			self.setGridMainMinHeight();
			self.setupListeners();
		}, 100);
	},
	setGridMainMinHeight: function() {
		var calculated_height;

		this.$grid_main = this.$angular_view_wrap.find('.grid .main-content');

		calculated_height = Math.floor(this.$grid_main.width() * 0.40);
		calculated_height = (calculated_height < 470 ? 470 : calculated_height);
		this.$grid_main.css('height', calculated_height);
		this.fitFrameToAngularView();
	},
	setupListeners: function() {
		var self = this;

		$(window).resize(function() { self.handleWindowResize(); });
	},
	handleWindowResize: function() {
		var self = this;
		clearTimeout(this.resize_timer);
		this.resize_timer = setTimeout(function() {
			self.$grid_main.css('height', 'inherit');
			self.fitFrameToAngularView();
		}, 50);
	},
	fitFrameToAngularView: function() {
		if (typeof this.$view_frame == 'undefined') {
			this.$view_frame = $('#view-frame');
		}

    if (typeof this.$angular_view_wrap == 'undefined' || this.$angular_view_wrap.outerHeight() == 0) {
			// NOTE: I was seeing some issue with jquery setting this variable before angular plugged in data.
			// This check effectively resets our pointer to animation-wrap. There may be a better solution though.
			this.$angular_view_wrap = $('#animation-wrap > #main');
		}

		this.$view_frame.css('min-height', 'auto');
		this.$view_frame.css('min-height', this.$angular_view_wrap.outerHeight() + 80); // I know. The hard coded 80px padding sucks.
	}
}

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

Application.layout.init();
Application.shareButton.init();