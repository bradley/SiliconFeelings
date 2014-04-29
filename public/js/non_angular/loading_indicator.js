;(function(_loading_indicators, $) {
    // Class constructor
    var Class = function() {
        return function(params) {
            if ( !(this instanceof arguments.callee) ) {
                return new arguments.callee(arguments);
            }
            this.initialize.apply(this,(params.callee ? params : arguments));
        };
    };

    var Loader = Class();
    Loader.prototype = {
        initialize: function(_loading_indicator){
            this.$loader = $(_loading_indicator);
            this.$overlay;
            this.loader_width = this.$loader.width();

            this.setComponents();
        },
        setComponents: function() {
            var $loading_outer = $("<div class='loading-outer'></div>"),
                $loading_inner = $("<div class='loading-inner'></div>");

            this.$overlay = $("<div class='loading-overlay'></div>");
            $loading_outer.width(this.loader_width);
            $loading_inner.width(this.loader_width);
            this.$overlay.width(this.loader_width);

            this.$loader.append($loading_outer);
            this.$loader.append($loading_inner);
            this.$loader.append(this.$overlay);
        },
        setProgress: function(progress) {
            console.log('testing');
            if (typeof progress === 'number' && progress >= 0 && progress <= 1) {
                var remaining = this.loader_width - (this.loader_width * progress);
                this.$overlay.width(remaining);
            }
            else {
                console.log('Progress sent to the setProgress() method must be a number between 0 and 1');
            }

        }
    }

    _loading_indicators.each(function(ix, o){
        $(o).data('Loader.instance', new Loader(o));
    });

    $.fn.setProgress = function(progress) {
        this.each(function() {
            $(this).data('Loader.instance').setProgress(progress);
        });
    }

    return _loading_indicators;

})($('.rainbow-loader'), jQuery);