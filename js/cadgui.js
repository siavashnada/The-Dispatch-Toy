$(document).ready(function() {	
	
	// generate the current date upon request
	function getDate(){		
		var currentTime = new Date()
		var month = currentTime.getMonth() + 1
		var day = currentTime.getDate()
		var year = currentTime.getFullYear()		
		var date = month + "/" + day  + "/" + year
		return date;
	}
	
	// generate the current time upon request
	function getTime(){
		var currentTime = new Date()
		var hours = currentTime.getHours()
		var minutes = currentTime.getMinutes()
		var seconds = currentTime.getSeconds()
		var time = hours + ":" + minutes + ":" + seconds + ""
		return time;
	}	
	
	// generate a new event number upon request
	var num = new Number();
	function getEventNum(){		
		var currentTime = new Date()
		var month = currentTime.getMonth() + 1
		var day = currentTime.getDate()
		var year = currentTime.getFullYear()	
		var eventNum = year.toString() + month.toString() + day.toString() + num.toString()			
		return eventNum;		
	}
	
	// keep the comments field current
	var comments = $("#comments").val();
	$("#comments").change( function(){
		comments = $("#comments").val();
		return comments;
	});		
	
	$(".textfield, #comments").focus( function(){		
		$(this).addClass("focused");	
	});   

	$(".textfield, #comments").blur( function(){
		$(this).removeClass("focused").removeClass("focused-err");	
		$("#error").hide().removeClass("ui-state-error").text("");
	}); 
	
	// create a new call	
	$("button[value='Create Call']").click( function(){
	
		// quick validate fields
		if ( $("#calltype").val().length == 0 ) { 
			$("#calltype").addClass("focused-err").focus(); 
			$("#error").addClass("ui-state-error").html("<span class='ui-icon ui-icon-alert float'></span><span class='float'>What's the Call Type?</span>").show(); 
			return false; 
		}
		if ( $("#incaddr").val().length == 0 ) { 
			$("#incaddr").addClass("focused-err").focus(); 
			$("#error").addClass("ui-state-error").html("<span class='ui-icon ui-icon-alert float'></span><span class='float'>Where is the call?</span>").show(); 
			return false; 
		}
		if ( $("#rpname").val().length == 0 ) { 
			$("#rpname").addClass("focused-err").focus(); 
			$("#error").addClass("ui-state-error").html("<span class='ui-icon ui-icon-alert float'></span><span class='float'>Who's the caller?</span>").show(); 
			return false; 
		}
		if ( $("#rpaddr").val().length == 0 ) { 
			$("#rpaddr").addClass("focused-err").focus(); 
			$("#error").addClass("ui-state-error").html("<span class='ui-icon ui-icon-alert float'></span><span class='float'>Where is the caller?</span>").show(); 			
			return false; 
		}
		if ( $("#phonenum").val().length == 0 ) { 
			$("#phonenum").addClass("focused-err").focus(); 
			$("#error").addClass("ui-state-error").html("<span class='ui-icon ui-icon-alert float'></span><span class='float'>What's the phone number?</span>").show(); 
			return false; 
		}		
		if ( $("#comments").val().length == 0 ) { 
			comments = "N/A"; 
		}
		
		// create call info
		var date = getDate();
		var time = getTime();		
		var callnum = getEventNum();				
		var calltype = $("#calltype").val();
		var incaddr = $("#incaddr").val();
		var rpname = $("#rpname").val();
		var rpaddr = $("#rpaddr").val();	
		var phonenum =  $("#phonenum").val();				

		$(".msg").remove();		

		// insert call record	
		$(".results").fadeTo(250, 0.25, function() { 
			$(".results").prepend("<div class='call'>"
				      + "<label>Incident Number:</label><span class='call-info'>" + callnum + "</span>" 
				      + "<label>Created:</label><span class='call-info'>" + date + " " + time + "</span>" 
				      + "<label>Call Type:</label><span class='call-info'>" + calltype + "</span>" 
				      + "<label>Incident Address:</label><span class='call-info'>" + incaddr + "</span>" 
				      + "<label>RP Name:</label><span class='call-info'>" + rpname + "</span>" 
				      + "<label>RP Address:</label><span class='call-info'>" + rpaddr + "</span>" 
				      + "<label>RP Phone Number:</label><span class='call-info'>" + phonenum + "</span>" 
				      +	"<p><button type='submit' value='Add Comment' class='button add-comment' >Add Comment</button></p>" 
 				      + "<p><label>" + time + "</label>" 
				      + "<span class='call-info'>" + comments + "</span></p></div>");
			$('.add-comment').button({
				icons: { 
					primary: 'ui-icon-comment'
				}
			});		  
		}).fadeTo(250,1);
		
		// geocode address
		codeAddress();
		
		num++		
		return false;			
	});

	// remove existing events
	$("button[value='Clear All Calls']").click( function(){
		$(".results").empty().append("<p class='msg ui-state-highlight float'><span class='ui-icon ui-icon-info float'></span><span class='float'>Your calls have been cleared!</span></p>");
		return false;
	});

	// append a comment to an existing call record
	$(".add-comment").live('click', function(){		
		
		var time = getTime();
		var index = $(".add-comment").index($(this));
		var thisCall = $(".call").get(index);	
		
		if ( $("#comments").val().length == 0 ) { 
			comments = "N/A"; 
		}
		
		$(thisCall).fadeTo(250,0.25, function(){
			$(thisCall).append("<p><label>" + time + "</label>"  + comments + "</p>" )
		}).fadeTo(250,1);		
		return false;
	});

	// initialize map display
	var latlng = new google.maps.LatLng(32.715, -117.158);
	var myOptions = {
			zoom: 13,
			center: latlng,
      		mapTypeId: google.maps.MapTypeId.TERRAIN
    	};
   	var map = new google.maps.Map(document.getElementById("map"), myOptions);
	
	// geocode address and update map
	geocoder = new google.maps.Geocoder();
	function codeAddress() {
    		var address = $("#incaddr").val();
			var type = $("#calltype").val();
			var evnum = getEventNum();
			geocoder.geocode( { 'address': address}, function(results, status) {
      			if (status == google.maps.GeocoderStatus.OK) {
					map.setCenter(results[0].geometry.location);

					var contentString = '<b>[ ' + evnum + ' ]</b><br/>' + type + '<br/>' + address ;

					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});
        			
					var marker = new google.maps.Marker({
            			map: map, 
            			position: results[0].geometry.location,
						title:"Event Number: " + evnum
       				});

					// marker click event
					infowindow.open(map,marker);
					google.maps.event.addListener(marker, 'click', function() {
						infowindow.open(map,marker);
					});

      			} else {
        			$("#error").text("Map can't display the address: " + status);
      			}
    		});
  	}
	
	// jQuery UI Widgets
	
	$("button[value='Create Call']").button({
		icons: { 
			primary: 'ui-icon-flag'
		}
	});
	$("button[value='Reset']").button({
		icons: { 
			primary: 'ui-icon-cancel'
		}
	});
	$("button[value='Clear All Calls']").button({
		icons: { 
			primary: 'ui-icon-trash'
		}
	});
	
	$('#dialog').dialog({ 
		autoOpen: false ,
		modal: true,
		width: 450,
		resizable: false
	});
	
	$("#connect").click(function(){
		$("#dialog").dialog("open");
		return false;
	});
	
	// autocomplete type codes
	var typeCodes = [
		"211 - Armed Robbery",
		"187 - Murder",
		]

	$( "#calltype" ).autocomplete({
			source: typeCodes
		});

	// format phone number as it is typed	http://snipplr.com/view/11578/jquery-snippet-to-convert-numbers-into-us-phone-number-format-as-theyre-typed/
	$("#phonenum").keyup(function() {
		var curchr = this.value.length;
		var curval = $(this).val();
		if (curchr == 3) {
			$("#phonenum").val("(" + curval + ")" + " ");
		} else if (curchr == 9) {
			$("#phonenum").val(curval + "-");
	}});
		
	// show and hide terms of use
	$("#terms").toggle(
		function(){
		$("#terms-text").show();
		},
		function(){
		$("#terms-text").hide();
		}		
	);
	 
});

