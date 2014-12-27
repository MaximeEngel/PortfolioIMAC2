$(document).ready(function() {
    var form = $('#contact form');
    var formMessage = $('#commentaire');


    $(form).submit(function(event) {
    	alert("test");
    	event.preventDefault();

    	var formData = $(form).serialize();

    	$.ajax({
		    type: 'POST',
		    url: $(form).attr('action'),
		    data: formData
		})
		.done(function(response) {
			alert("success"+response) ;
		})
		.fail(function(response) {
			alert("fail"+response) ;
		});  
	});
});