//-------------------------------------------------------------------------------------------------------------
//AveragePay page functions
//-------------------------------------------------------------------------------------------------------------		
$( document ).ready(function(){
	$("#avgPayList").empty();
});

$("#submitAge").on('click', function(){
	var userAge = $("#ageInput").val();
	var skills = new Array();
	var myJSonData = {"skillSet": skills};
	var myJsonString = localStorage.getItem('skillsStore');
	if(myJsonString != null){
		myJSonData = JSON.parse(myJsonString);
		$.each(myJSonData.skillSet, function(i, skill){
			var apiURL = "http://api.lmiforall.org.uk/api/v1/soc/search?q=";
			var apicall = apiURL + skill;
			$.get(apicall, function(data){
				$.each(data, function(i, e){
					(function(soc, title){
						var payapiURL = "http://api.lmiforall.org.uk/api/v1/ashe/estimatePay?soc=";
						var payapicall = payapiURL + e.soc + "&age=" + userAge + "&coarse=false";
						alert(payapicall);
						$.get(payapicall, function(paydata){
							alert("Estimated pay " + paydata.series.estpay);
							$("#avgPayList").append("<li>" + e.title + ": Average Pay = <strong> £ " + paydata.series.estpay + "</strong></li>" );
						});	
					})(e.soc, e.title);	
				});
			});
		});	
	}
});