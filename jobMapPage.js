//-------------------------------------------------------------------------------------------------------------
//jobMap page functions
//-------------------------------------------------------------------------------------------------------------

$(document).on('pagecreate', "#jobMap", function(){
	showMap();
});

function showMap(){
	$.getScript('http://maps.google.com/maps/api/js?sensor=false&v=3&libraries=geometry');

    if ( navigator.geolocation ) {
       function success(pos) { //show map with user location
			var userPos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			var mapOptions = {
				center:userPos,
				zoom:12,
				mapTypeId:google.maps.MapTypeId.ROADMAP
			};
			var jobsMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
			var marker = new google.maps.Marker({
				position: userPos,
				map: jobsMap,
				title: "User location"
			});
			addJobMarkers(jobsMap, userPos);        }
       function fail(error) {
            alert("Unable to locate you on the map");
       }
       // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        alert("Unable to show map");
    }
}

function addJobMarkers(jobsMap, userPos){
	var skills = new Array();
	var myJSonData = {"skillSet": skills};
	var myJsonString = localStorage.getItem('skillsStore');
	if(myJsonString != null){
		myJSonData = JSON.parse(myJsonString);
		$.each(myJSonData.skillSet, function(i, skill){
			addLocalMarkers(skill, jobsMap, userPos);
		});
	}
}


function addLocalMarkers(skillName, jobsMap, userPos){
	var apiurl = "http://api.lmiforall.org.uk/api/v1/vacancies/search?limit=50&keywords=";
	var apicall = apiurl + skillName;
	$.get(apicall, function(data){
		$.each(data, function(i, e){
			(function(jobTitle, company, postcode){
			if(i==0){
				var geocoder = new google.maps.Geocoder();
				var address = e.location.postcode;
				geocoder.geocode({'address': address}, function(geodata, status){
					if (status == google.maps.GeocoderStatus.OK) {
						var infoString = "Position: " + e.title + "\n @:" + e.company;
						var pos = new String(geodata[0].geometry.location);
						var mkPos = pos.substring(1, pos.length-1);
						var latlngStr = mkPos.split(",",2);
						var lat = parseFloat(latlngStr[0]);
						var lng = parseFloat(latlngStr[1]);
						var markerPos = new google.maps.LatLng(lat, lng);
						if(google.maps.geometry.spherical.computeDistanceBetween (userPos, markerPos) < 30000){
							var marker = new google.maps.Marker({
								map:jobsMap,
								position: markerPos,
								title:infoString
							});
						}
					} else {
						alert("Geocode was not successful for the following reason: " + status);
					}
				});
			}
			})(e.title, e.company, e.location.postcode);
		});
	});
}