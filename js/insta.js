	
(function() {

	// insta

	var insertInsta = function(data) {
		$.ajax({
			url: document.location.href.split("/").slice(0, -1).join("/") + "/inwidget-master/index.php?imgCount=5",
			success: function(data) {
				var data = JSON.parse(data);
				data.forEach(function(i, index) {
				if(index > 4)
						return false;
					var block = document.createElement("div");
					var inner = document.createElement("div");
					inner.style.cssText = "background-image: url('" + i.fullsize + "')";
					inner.className = "insta_block-inner";
					block.className = "insta_block";
					block.appendChild(inner);
					$(".insta_blocks").append(block);
				})
			},
			error: function(data) {
				console.log(data);
			}
		})
	}


	$(document).ready(function() {
		insertInsta();
	})

})()