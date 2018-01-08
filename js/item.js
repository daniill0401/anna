;(function() {

	var item = {
		init: function() {
			this.mainImg = $(".item_main-img");
			this.currentImg = $(".item_main-img").css("background-image").replace("url(\"", "").replace("\")", "");
			this.blocks = $(".item_rest-img");
			this.listen();
		},
		changeMain: function() {
			var that = this;
			var oldBack = item.mainImg.css("background-image");
			var newBack = $(that).css("background-image");
			item.currentImg = $(that).css("background-image").replace("url(\"", "").replace("\")", "");
			item.mainImg.animate({"opacity": "0"}, 200, function() {
				item.mainImg.css("background-image", newBack);
				item.mainImg.animate({"opacity": "1"}, 500);
			});
			$(that).animate({"opacity": "0"}, 200, function() {
				$(that).css("background-image", oldBack);
				$(that).animate({"opacity": "1"}, 500);
			});
			item.initZoom();
		},
		initZoom: function() {
			this.mainImg.zoom({
				url: this.currentImg,
				magnify: 2
			});
		},
		listen: function() {
			this.blocks.on("click", this.changeMain);
			this.initZoom();
		}
	}

	$(document).ready(function() {

		$(".item_rest").slick({
			slidesToShow: 3,
			adaptiveHeight: true,
			vertical: true,
			prevArrow: "<img class='item_arrow item_arrow-prev' src='../img/up-arrow.png'>",
			nextArrow: "<img class='item_arrow item_arrow-next' src='../img/down-arrow.png'>",
			responsive: [
				{
					breakpoint: 1199,
					settings: {
						vertical: false,
						slidesToShow: 2
					}
				},
				{
					breakpoint: 858,
					settings: {
						vertical: false,
						slidesToShow: 1
					}
				}
			]
		});

		item.init();

	})

})()