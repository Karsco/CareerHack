//-------------------------------------------------------------------------------------------------------------
//SkillsCheck page functions
//-------------------------------------------------------------------------------------------------------------

$(document).on('pagecreate', "#skillsPage", function(){
	showSkillsCheckList();
});

function showSkillsCheckList(){
	var skills = new Array();
	var myJSonData = {"skillSet": skills};
	var myJsonString = localStorage.getItem('skillsStore');
	if(myJsonString != null){
		myJSonData = JSON.parse(myJsonString);
		$.each(myJSonData.skillSet, function(i, skill){
			skills.push(skill);
		});
	};

	var apicall = "http://api.lmiforall.org.uk/api/v1/onet/skills";
	$.get(apicall, function(data){
		$.each(data, function(i, e){
			(function(shortname, description){
				var checkBoxInput = $("<p><input type='checkbox' name='" + e.shortname + "' id = '" + e.shortname + "' />" + e.description + "</p>");
				$("#skillsList").append(checkBoxInput);
				if($.inArray(e.shortname, skills) != (-1)){
					var checkId = "#" + e.shortname;
					$(checkId).prop("checked", true);
				}
			})(e.shortname, e.description);
		});
	});
}

$("#skillsPage").live("pagebeforehide", function(){
	try{
		localStorage.removeItem('skillsStore');
	}
	catch(e){
		if (e == QUOTA_EXCEEDED_ERR){
               alert("Quota Exceeded");
        }
	}
	var skills = new Array();
	$('#skillsList input:checked').each(function() {
		skills.push(this.id);
	});
	var myJSonData = {"skillSet": skills};
	var myJsonString = JSON.stringify(myJSonData);
	localStorage.setItem('skillsStore', myJsonString);
});