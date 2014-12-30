var $mainPage ;
var $projet ;
var $loader;
var sliderOptions;

$(document).ready(function() {


	$projet = $("#projet");
	$projet.hide() ;

	$loader = $("#loader") ;
	$loader.hide() ;

	$mainPage = $("#mainPage");


	var isHistoryDefined = true ;
	if (typeof history.pushState === 'undefined')
		isHistoryDefined = false ;

	$(document).on('click', '.loadProjet', function(event){
		event.preventDefault();
		var $a = $(this);
		var json = $a.attr("data-json");
		if(isHistoryDefined)
			history.pushState({key: "value"}, 'titre', '/projet/'+json);
		loadProjet(json);
	});

	window.onpopstate = function(event) {
		if(event.state == null)
		{			
			$projet.fadeOut(200, function(){
				wow.init() ;
				$doc = $(document);
				$doc.scrollTop($doc.scrollTop() + 1);
				$mainPage.fadeIn(200);
			}) ;
		}
		else
		{
			var pathname = document.location.pathname;
			loadProjet(pathname.substr(pathname.lastIndexOf("/")+1));
		}
	};



});

function resetOptionsSlider(){
	var mediaWidth = $(window).width()* (parseInt($("#media").css("width"))/100);
	alert(mediaWidth);
	sliderOptions = {
		'progressColor':  $("#cover").css("background-color"),
	/*	'width' : mediaWidth,
		'height' : (mediaWidth*9/16)*/
	};
}

function loadProjet(json)
{
	$loader.fadeIn(100);
	$.getJSON("../json/projets/"+json+".json", function(data) {	

		// Titre
		$("#projet h2").html(data.titre);
		$("#projet h2").attr("data-hover", data.titre);

		// Acrroche
		$("#accroche").html(" &nbsp;<p>"+data.accroche+"</p>&nbsp;");

		// Cache tous les elements de descriptions, remplit ceux que le json a et les affiche
		$(".cachable").hide();
		$.each(data.description, function(key, val){
			console.log(key+" "+val);
			var $cont = $("#"+key+"Js");
			$cont.html(val);
			$cont.parent().show();
		});

		// Slider
		$("#media").html("<div id='slider'></div>");
		var $slider = $("#slider") ;
		$slider.html('');
		$.each(data.medias, function(key, val){
			var media ;
			switch(val.type)
			{
				case "img" :
					media = "<img data-lazy-src='/img/"+val.src+"' alt='Réalisation "+data.titre+"'>";
					break;
				case "html" :
					media = "<div>"+val.src+"</div>";
					break;
			}
			$slider.append(media);
		});


		resetOptionsSlider();
		var slider = $slider.DrSlider(sliderOptions);
		
		$loader.hide();
		$mainPage.fadeOut(200, function(){
			$projet.fadeIn(200) ;
		});
	})
	.fail(function() {
		$loader.hide();
	});
}