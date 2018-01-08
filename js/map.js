
;var map = (function() {


	var map = {
		init: function() {
			this.countryButton = $(".map_choose-country .map_choose-label");
			this.countryList = $(".map_choose-country .map_choose-list");
			this.countryLis = $(".map_choose-country .map_choose-li");
			this.countryInput = $(".map_choose-country .map_choose-input");
			this.cityButton = $(".map_choose-city .map_choose-label");
			this.cityList = $(".map_choose-city .map_choose-list");
			this.cityLis = $(".map_choose-city .map_choose-li");
			this.cityInput = $(".map_choose-city .map_choose-input");
			this.searchButton = $(".map_button");
			this.points = {"Italy":["Milan"],"United States":["Melbourne Beach","Streamwood"],"France":["Paris"]};
			this.centers = {"Italy":[{"lat":45.4717869,"lng":9.190467500000068}],"United States":[{"lat":28.0623011,"lng":-80.55520589999998},{"lat":42.0083148,"lng":-88.1638069}],"France":[{"lat":48.8527385,"lng":2.3445200999999543}]};
			this.geocoder = new google.maps.Geocoder();
			this.window = $("#map");
			this.currentCountry = "";
			this.currentCity = "";
			this.currentAddress = "";
			this.options = {};
			this.prepare();
			this.listen();
		},
		countryShow: function() {
			map.countryList.fadeIn();
			$(this).addClass("active");
		},
		cityShow: function() {
			map.cityList.fadeIn();
			$(this).addClass("active");
		},
		countryHide: function() {
			map.countryList.fadeOut();
			$(this).removeClass("active");
		},
		cityHide: function() {
			map.cityList.fadeOut();
			$(this).removeClass("active");
		},
		changeCountry: function() {
			var country = $(this).text();
			map.prepareCities(country);
			map.currentCountry = country;
			map.countryInput.text(country);
			map.cityInput.text("");
			map.options.zoom = 6;
			map.currentAddress = map.currentCountry;
			map.countryHide();
			// map.changeCenter(map.currentAddress);
		},
		changeCity: function() {
			var city = $(this).text();
			map.currentCity = city;
			map.cityInput.text(city);
			map.options.zoom = 14;
			map.currentAddress = map.currentCountry + map.currentCity;
			map.cityHide();
			// map.changeCenter(map.currentAddress);
		},
		changeAddress: function() {
			map.changeCenter(map.currentAddress);
		},
		setOptions: function(options) {
			gMap.setOptions(options);
		},
		changeCenter: function(address) {
			map.getCenter(address, map.setCenter);
			map.setOptions(map.options);
		},
		getCenter: function(address, callback) {
			map.geocoder.geocode({"address": address}, function(results, status) {
				if (status == "OK"){
					var center = results[0].geometry.location;
					center = { lat: center.lat(), lng: center.lng() };
					callback(center);
					}
				}
			)
		},
		setCenter: function(center) {
			gMap.setCenter(center);
		},
		insertLis: function(wrapper, array) {
			$.each(array, function(index, item) {
				map.insertLi(wrapper, item, index);
			});
		},
		insertLi: function(wrapper, text, index) {
			$(wrapper)
				.append('<li class="map_choose-li map_choose-li-' + (index+1) + '" data-index="' + index + '">' + text + '</li>')
		},
		clearCities: function() {
			map.cityList.html("");
		},
		preparePointsFromAddresses: function(index) {
			setTimeout(function() {
				index = index || 0;
				map.getCenter(shops[index], function(center) {
					getCountryCity(center, function(result) {
						console.log(result);
						if(!map.points[result.country]){
							map.points[result.country] = [];
						}
						if(!map.centers[result.country]){
							map.centers[result.country] = [];
						}
						if(map.points[result.country].indexOf(result.city) == -1)
							map.points[result.country].push(result.city);
						map.centers[result.country].push(center);
						
						if(index+1<shops.length){
							map.preparePointsFromAddresses(index+1);
						}
						else {
							map.preparePoints();
							setTimeout(function() {
								map.prepareMarkers();
							}, 1000)
						}
					})
				});
			}, 20)
		},
		preparePoints: function() {
			var index = 0;
			$.each(this.points, function(country, cities) {
				map.insertLi(map.countryList, country, index);
				index++;;
			});
			this.prepareCities(Object.keys(this.points)[0]);
		},
		prepareCities: function(country) {
			map.clearCities();
			map.insertLis(map.cityList, map.points[country]);
		},
		prepareMarkers: function(center) {
			$.each(map.centers, function(country, centers) {
				$.each(centers, function(index, center) {
					console.log(center);
					var marker = new google.maps.Marker({
						position: center,
						map: gMap
					});
				})
			})
		},
		prepare: function() {
			// map.preparePointsFromAddresses();
			map.preparePoints();
			setTimeout(function() {
				map.prepareMarkers();
			}, 1000)
		},
		listen: function() {
			this.countryButton.hover(this.countryShow, this.countryHide);
			// this.countryButton.clicktoggle(this.countryShow, this.countryHide);
			this.cityButton.hover(this.cityShow, this.cityHide);
			// this.cityButton.clicktoggle(this.cityShow, this.cityHide);
			this.countryList.on("click", "li", this.changeCountry);
			this.cityList.on("click", "li", this.changeCity);
			this.searchButton.on("click", this.changeAddress);
		}
	}

	$(document).ready(function() {
		map.init();
	})

	var getCountryCity = function(center, callback) {
		new google.maps.Geocoder().geocode({'location' : center}, function(results, status) {
			console.log(results);
			if(!results){
				setTimeout(function() {
					getCountryCity(center, callback)
				}, 100);
			}
		    if (status == google.maps.GeocoderStatus.OK) {
		        if (results[1]) {
		            var country = null, countryCode = null, city = null, cityAlt = null;
		            var c, lc, component;
		            for (var r = 0, rl = results.length; r < rl; r += 1) {
		                var result = results[r];

		                if (!city && result.types[0] === 'locality') {
		                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
		                        component = result.address_components[c];

		                        if (component.types[0] === 'locality') {
		                            city = component.long_name;
		                            break;
		                        }
		                    }
		                }
		                else if (!city && !cityAlt && result.types[0] === 'administrative_area_level_1') {
		                    for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
		                        component = result.address_components[c];

		                        if (component.types[0] === 'administrative_area_level_1') {
		                            cityAlt = component.long_name;
		                            break;
		                        }
		                    }
		                } else if (!country && result.types[0] === 'country') {
		                    country = result.address_components[0].long_name;
		                    countryCode = result.address_components[0].short_name;
		                }
		                else if(!country){
		                	$.each(results[1].address_components, function(key, item) {
		                		if(item.types && item.types[0]=="country")
		                			country=item.long_name;
		                	})
		                }

		                if (city && country) {
		                    break;
		                }
		            }
		            callback({
	    	            	country: country,
	    	            	city: city
	    	            });
		            // console.log("City: " + city + ", City2: " + cityAlt + ", Country: " + country + ", Country Code: " + countryCode);
		        }
		    }
		});
	}

	return {
		prepareMarkers: map.prepareMarkers
	}

})()
	var gMap;
	var createMap = function() {
		var map = document.getElementById('map');
		var address = "Kissena Park";

		var mapOptions = {
			zoom: 14,
			disableDefaultUI: true,
			zoomControl: true,
			scrollwheel: false,
			panControl: false,
			streetViewControl: false,
			overviewMapControl: false,
			mapTypeControl: false
		};

		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"address": address}, function(results, status) {
			if (status == "OK"){
				var center = results[0].geometry.location;
				center = { lat: center.lat(), lng: center.lng() };
				mapOptions.center = { lat: center.lat, lng: center.lng };
				gMap = new google.maps.Map(map, mapOptions);
			}
		})
	}