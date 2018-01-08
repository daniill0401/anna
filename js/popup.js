;(function() {

	var popup = {
		wrapper: $(".popup-contact"),
		cross: $(".contact_cross"),
		triggers: $(".contact_cross, .contact_us"),
		sendButton: $(".popup-mail-button"),
		showHide: (function() {
			var state = 0;
			return function(e) {
				e.preventDefault();
				if(state%2==0){
					popup.wrapper.fadeIn();
				}
				else {
					popup.wrapper.fadeOut();
				}
				state++;
			}
		})(),
		send: function(e) {
			e.preventDefault();
		},
		listen: function() {
			this.triggers.on("click", this.showHide);
			this.sendButton.on("click", this.send);
		}
	}

	$(document).ready(function() {
		popup.listen();
	})

	
})()