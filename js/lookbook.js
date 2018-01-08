;(function() {

	var lookbook = {
		items: $(".lookbook_block"),
		shown: parseInt($(".lookbook_wrapper").data("show")),
		moreButton: $(".lookbook_more"),
		sources: [],
		popup: $(".lookbook_popup"),
		popupTrigger: $(".lookbook_popup-cross, .lookbook_popup-overlay"),
		popupWindows: [$(".lookbook_popup-window-1"), $(".lookbook_popup-window-2")],
		popupCurrent: 1,
		popupArrows: $(".lookbook_popup-arrow"),
		showMore: function() {
			var l = lookbook.items.length;
			var enough = lookbook.shown + 4;
			$.each(lookbook.items, function(index, item) {
				if(index >= lookbook.shown && index < enough){
					$(item).fadeIn()
					lookbook.shown++;
				}
			})
			lookbook.checkMore();
		},
		checkMore: function() {
			if(lookbook.shown >= lookbook.items.length){
				lookbook.moreButton.fadeOut();
			}
		},
		popupShowHide: (function() {
			var state = 0;
			return function() {
				if(state%2==0){
					lookbook.popup.fadeIn();
				}
				else {
					lookbook.popup.fadeOut();
				}
				state++;
			}
		})(),
		photoClick: function() {
				var inner = $(this).find(".lookbook_block-inner");
				var src = inner.css("background-image").replace("url(\"", "").replace("\")", "");
				var activeSlide = lookbook.popupWindows[0];
				lookbook.popupWindows[1].fadeOut();
				var img = new Image();
				img.src = src;
				activeSlide.css("background-image", "url('" + src + "')");
				activeSlide.fadeIn();
				lookbook.popupShowHide();
				lookbook.popupCurrent = parseInt(inner.data("index"));
		},
		photoMove: (function() {
			var state = 1;
			return function() {
				var where = this.className.baseVal.search("left")!==-1 ? -1 : 1;
				var l = lookbook.items.length;
				var next = (lookbook.popupCurrent+where)%l >= 0 ? (lookbook.popupCurrent+where)%l : l-1;
				var activeSlide = lookbook.popupWindows[state%2];
				var nextSrc = lookbook.sources[next];
				var img = new Image();
				img.src = nextSrc;
				activeSlide.css("background-image", "url('" + nextSrc + "')");

				activeSlide.fadeIn();
				lookbook.popupWindows[(state+1)%2].fadeOut();
				state++;
				lookbook.popupCurrent = next;
			}
		})(),
		prepare: function() {
			$.each(lookbook.items, function(index, item) {
				lookbook.sources.push($(item).find(".lookbook_block-inner").css("background-image").replace("url(\"", "").replace("\")", ""));
				if(index>=lookbook.shown){
					$(item).fadeOut(1);
				}
			});
			lookbook.checkMore();
		},
		listen: function() {
			this.prepare();
			this.moreButton.on("click", this.showMore);
			if(this.popup.length>0){
				this.popupTrigger.on("click", this.popupShowHide);
				this.items.on("click", this.photoClick);
				this.popupArrows.on("click", this.photoMove);
			}
		}
	}

	$(document).ready(function() {
		lookbook.listen();
	})


})()