var $mainPage ;
var $projet ;
var $loader;

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
				$mainPage.fadeIn(200);
			}) ;
		}
		else
		{
			var pathname = document.location.pathname;
			loadProjet(pathname.substr(pathname.lastIndexOf("/")+1));
		}
	}
});

function loadProjet(json)
{
	$loader.fadeIn(100);
	$.getJSON("../json/projets/"+json+".json", function(data) {
		
		$("#projet h2").html(data.titre);
		
		$loader.hide();
		$mainPage.fadeOut(200, function(){
			$projet.fadeIn(200) ;
		});
	})
	.fail(function() {
		$loader.hide();
	});
}