$(document).ready(function() {
    var form = $('#contact form');
    var formMessage = $('#commentaire');


    $(form).submit(function(event) {
    	event.preventDefault();

    	var formData = $(form).serialize();

    	$.ajax({
		    type: 'POST',
		    url: $(form).attr('action'),
		    data: formData
		})
		.done(function(response) {
			$("#pEnvoieMessage").prepend("<p class='wow fromRight'>"+response+"</p>");
		})
		.fail(function(response) {		
			$("#pEnvoieMessage").prepend("<p class='wow fromRight' style='color:red;'>Oops! Un problème est survenu, merci d'envoyer un message à <a data-hover='maximeengel@gmail.com' href='mailto:maximeengel@gmail.com' class='btn-noirBlanc'>maximeengel@gmail.com</a>.</p>");
		});  
	});
});