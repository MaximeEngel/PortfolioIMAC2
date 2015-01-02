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

		// Projet precedent basé sur le DOM 
		var json = $a.nextAll(".loadProjet").first().attr("data-json");
		console.log("next "+json+"  "+(typeof json !== 'undefined'));
		if (typeof json !== 'undefined')
			$("#suivant").attr("data-json", json).css("display", "inline") ;
		else
			$("#suivant").hide() ;
		// Projet suivant basé sur le DOM
		json = $a.prevAll(".loadProjet").first().attr("data-json");
		console.log("prev "+json +"  "+(typeof json !== 'undefined'));
		if (typeof json !== 'undefined')
			$("#precedent").attr("data-json", json).css("display", "inline") ;
		else
			$("#precedent").hide() ;

		var json = $a.attr("data-json");

		$("#accueil").attr("href", json);
		if(isHistoryDefined){			
			var cheminComplet = document.location.href;
			var cheminRepertoire  = cheminComplet.substring(0, cheminComplet.lastIndexOf( "/" ) );
			history.pushState({key: "value"}, 'titre', cheminRepertoire+'?projet='+json);
		}

		loadProjet(json);
	});

	$("#projet #precedent, #projet #suivant").click(function(event){
		// Si click sur projet suivant/precedent alors on lance le code précédent avec un click virtuel sur le projet correspondant.
		event.preventDefault()
		$("#"+$(this).attr("data-json")).click();
	})

	$("#accueil").click(function(event){
		event.preventDefault()
		var cheminComplet = document.location.href;
		var cheminRepertoire  = cheminComplet.substring(0, cheminComplet.lastIndexOf( "/" ) );
		history.pushState(null, "index", cheminRepertoire);
		$projet.fadeOut(200, function(){
			wow.init() ;
			$mainPage.fadeIn(200);

				$doc = $(document);
				$doc.scrollTop($("#"+$("#accueil").attr("href")).offset().top - 60);
		}) ;
	});

	// Si la page est chargé directement sur un projet (urlhomePage?projet=...) alors on lance le code précédent avec un click virtuel sur le projet correspondant.
	var projet = getUrlVars()["projet"];
	if (projet !== 'undefined')
	{
		$("#"+projet).click() ;
	}



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


	function loadProjet(json)
	{
		$loader.fadeIn(100);
		$.getJSON("json/projets/"+json+".json", function(data) {	

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
				$cont.parent().css("display", "inline-block");
			});

			// VIDEOS
			$("#media").html("");
			if (typeof data.videos !== 'undefined'  )
			{
				$("#media").append("<div id='videos'></div>");
				$.each(data.videos, function(key, val){
					$("#videos").append("<div class='borderStyle'></div><div class='embed-container'>"+val.src+"</div>");
				});
			}

			// Slider
			if (typeof data.slider !== 'undefined' )
			{
				if (data.slider.length > 1 )
				{
					$("#media").append("<div id='sliderWrap'><div class='borderStyle'></div><div id='slider'></div><div><a href='#' class='go-previous'></a><a href='#' class='go-next'></a></div></div>");
					var $slider = $("#slider") ;
					$slider.html('');
					$.each(data.slider, function(key, val){
						var media ;
						switch(val.type)
						{
							case "img" :
								media = "<a href='/img/"+val.src+"'><img data-lazy-src='/img/"+val.src+"' alt='Réalisation "+data.titre+"'></a>";
								break;
							case "html" :
								media = "<div>"+val.src+"</div>";
								break;
						}
						$slider.append(media);
					});
					resetOptionsSlider();
					var slider = $slider.DrSlider(sliderOptions);
				}
				else if (data.slider.length > 0 )
				{
					$("#media").append("<div id='sliderWrap'><div class='borderStyle'></div><a href='/img/"+data.slider[0].src+"'><img class='responsive' src='/img/"+data.slider[0].src+"' alt='Réalisation "+data.titre+"'></a></div>");
				}			
			}
			
			$loader.hide();
			$mainPage.fadeOut(200, function(){
				
				$projet.fadeIn(200, function(){
					// Hack pour wow quand rien nest visible car aucun scroll
					var $doc = $("html, body") ;
					if ($(window).height() < $("#projet").height()){						
						wow.init();
						$doc.scrollTop(10);
					}
					$doc.scrollTop(0);
				}) ;
			});
		})
		.fail(function() {
			$loader.hide();
		});
	}


});

function resetOptionsSlider(){
	var sliderWidth = $(window).width()* (parseInt($("#sliderWrap").css("width"))/100);
	sliderOptions = {
		'progressColor':  $("#cover").css("background-color"),
		// 'width' : sliderWidth+"px",
		'showControl': false,
        'showNavigation': false,
        'classButtonPrevious': 'go-previous',
        'classButtonNext': 'go-next',
        'transition' : 'random',
        'duration' : 6000
		// 'height' : (sliderWidth*9/16)+"px"
	};
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}