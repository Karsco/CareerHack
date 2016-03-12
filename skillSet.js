//-------------------------------------------------------------------------------------------------------------
//SkillsSet page functions
//-------------------------------------------------------------------------------------------------------------

$(document).on('pagecreate', "#skillSetPage", function(){
	populateJobList();
});

function populateJobList(){
	var skills = new Array();
	var myJSonData = {"skillSet": skills};
	var myJsonString = localStorage.getItem('skillsStore');
	if(myJsonString != null){
		myJSonData = JSON.parse(myJsonString);
		$.each(myJSonData.skillSet, function(i, skill){
			addRelevantJobToList(skill);
		});
	}
}

function addRelevantJobToList(skillName){
	var apiurl = "http://api.lmiforall.org.uk/api/v1/soc/search?q=";
	var apicall = apiurl + skillName;
	$.get(apicall, function(data){
		$.each(data, function(i, e){
			(function(title, description){
				var newListItem = $("<li><p><strong>" + e.title + "</strong></p><p>" + e.description + "</p></li>");
				$("#jobsList").append(newListItem);
			})(e.title, e.description);
		});
	});
}