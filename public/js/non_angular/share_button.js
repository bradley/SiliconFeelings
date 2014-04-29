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

Application.shareButton.init();