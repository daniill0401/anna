;(function() {


	var menu = {
		wrapper: $(".menu_wrapper"),
		items: $(".menu_item"),
		line: $(".menu_line"),
		collections: $(".menu_collections"),
		mobileButton: $(".menu_svg"),
		mobileMenu: $(".mobile_menu"),
		mobileItems: $(".mobile_menu_item-text"),
		mobileCross: $(".mobile_menu-close"),
		addWidth: 10,
		on: false,
		itemHover: function() {
			if($(this).data("index")=="0")
				return false;
			menu.lineHandle(this);
			menu.on = true;
		},
		collectionsOver: function() {
			$(this).parents(".menu_wrapper").find(".menu_collections").fadeIn();
		},
		collectionsOut: function() {
			$(this).parents(".menu_wrapper").find(".menu_collections").fadeOut();
		},
		itemOut: function() {
			$(".menu_line").css({
				"width": ""
			});
		},
		itemClick: function(hash) {
			// ("#" + $(this).data("href")) || 
			var to = $(this).data("href") ? ("#" + $(this).data("href")) : hash;
			var toItem = $(to);
			if(toItem.length == 0){
				document.location.assign(document.location.href.split("/").slice(0, -1).join("/") + to);
			}
			else
				$("html, body").animate({"scrollTop": toItem.offset().top - 20}, "slow");
		},
		checkHash: function() {
			var hash = document.location.hash;
			if(hash){
				menu.itemClick(hash);
				document.location.hash = "";
			}
		},
		lineHandle: function(item) {
			var width = $(item).width() + menu.addWidth;
			var left = $(item).find(".menu_item-text").offset().left - menu.wrapper.offset().left - menu.addWidth/2;
			menu.line.css({
				"width": width,
				"left": left
			})
		},
		mobileMenuHandle: function() {
			menu.mobileClick();
			menu.itemClick.call(this);
		},
		mobileClick: (function() {
			var state = 0;
			return function() {
				if(state%2==0){
					menu.mobileShow();
				}
				else {
					menu.mobileHide();
				}
				state++;
			}
		})(),
		mobileShow: function() {
			menu.mobileButton.addClass("active");
			menu.mobileMenu.fadeIn();
		},
		mobileHide: function() {
			menu.mobileButton.removeClass("active");
			menu.mobileMenu.fadeOut();
		},
		clearHash: function() {
			document.location.hash = "";
		},
		prepareFooterCollection: function() {
			$(".footer_wrapper .menu_collections").css("top", -$(".footer_wrapper .menu_collections").outerHeight()+5)
		},
		prepare: function() {
			menu.prepareFooterCollection();
		},
		listen: function() {
			this.items.hover(this.itemHover, this.itemOut);
			this.items.on("click", this.itemClick);
			$(".menu_item-1").hover(this.collectionsOver, this.collectionsOut);
			this.mobileButton.click(this.mobileClick);
			this.mobileCross.click(this.mobileClick);
			this.mobileItems.click(this.mobileMenuHandle);
			this.prepare();
			// this.clearHash();
		}
	}

	$(document).ready(function() {
		menu.listen();
	})

	window.onload = function(e) {
		menu.checkHash(e);
	}

})()