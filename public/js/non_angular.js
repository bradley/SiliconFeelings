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
		if (this.$grid_main.height() < calculated_height) {
			this.$grid_main.css('height', calculated_height);
		}
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
		this.$popupLink = $('.popup');

		this.setupListeners();
	},
	setupListeners: function() {
		var self = this;

		this.$perspective_button_container.bind('click', function() { self.toggleShareable(); });
		this.$popupLink.bind('click', function(e) { self.preparePopup(e, this); });
	},
	toggleShareable: function() {
		this.$perspective_button_container.toggleClass('active');
		this.$shareable_text_container.toggleClass('active');
	},
	preparePopup: function(event, element) {
		event.preventDefault();
    var width = 575,
        height = 247,
        url = element.href,
        title = element.text;

    this.popupCenter(url, title, width, height);
    return false;
	},
	popupCenter: function(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
    		dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,
    		left, top, newWindow;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    left = ((width / 2) - (w / 2)) + dualScreenLeft;
    top = ((height / 2) - (h / 2)) + dualScreenTop;
    newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
  }
}

Application.layout.init();
Application.shareButton.init();

