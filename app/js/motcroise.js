var grilleJson  ;
var grilleReponse = new Array() ;
var grilleProposition = new Array() ;
var caseSelectedId = null ;
var taillePolice = 15 ;
var nomGrille = "grille1" ;
var defaultGrille = "longmetrage";
var mobile = 0 ;

$(document).ready(function() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		mobile = 1 ;
	}
	jQuery.ajaxSetup({ cache: false });
	loadLastGrille() ;
	initGrille(nomGrille) ;	
	$(".loadGrille").click(function(){
		initGrille($(this).attr("data-grille")) ;		
	}) ;
	$("#motCroiseGrille").on('click',".caseGrille", function(){
		selectionCase(this) ;
	}) ;
	$("body").on('click',"#grilleGagne", function(){
		selectionCase(this) ;
	}) ;
	$("body").on('click',"#quitteGagne", function(){
		quitteGagne() ;
	}) ;
	$("#reinitGrille").click(function(){
		reinitGrille() ;	
	}) ;
	$("#showAnswer").click(function(){
		showAnswer() ;	
	}) ;
	$(document).keydown(function(evt){
		if (evt.keyCode >= 65 && evt.keyCode <= 90  || evt.keyCode == 46 ) { // Lettre ou Suppr
			if ( evt .keyCode == 46 ) {
				$("#"+caseSelectedId).text('') ;
				grilleProposition[$("#"+caseSelectedId).attr("data-case-y")][$("#"+caseSelectedId).attr("data-case-x")] = 0 ;
			} else {
				var lettre = String.fromCharCode(evt.keyCode) ;
				$("#"+caseSelectedId).text(lettre) ;
				grilleProposition[$("#"+caseSelectedId).attr("data-case-y")][$("#"+caseSelectedId).attr("data-case-x")] = lettre ;
			}
			$("#"+caseSelectedId).css("font-size", "0px").animate({"font-size" : (taillePolice+5)+"px" }, 100, "swing", function() { $("#"+caseSelectedId).animate({"font-size" : taillePolice+"px" }, 50) ; }) ;
			
			saveGrille() ;
			if ( validerGrille() ) {
				afficheGagne() ;
			}
		} else {
			switch(evt.keyCode) { // Flèche
				case 38: //Haut
					evt.preventDefault() ;
					deplacement(0, -1) ;
					break ;
				case 40: // Bas
					evt.preventDefault() ;
					deplacement(0, 1) ;
					break ;
				case 37: // Gauche
					evt.preventDefault() ;
					deplacement(-1, 0) ;
					break ;
				case 39: //Droit
					evt.preventDefault() ;
					deplacement(1, 0) ;
					break ;
			}
		}

	}) ;
	$( window ).resize(function() {
		drawGrille(grilleProposition) ;
	}) ;
}) ;

function initGrille(grille) {
	$("#motCroiseGrille").html('') ;	
	$("#motCroiseDescriptionVerticaux").html('') ;	
	$("#motCroiseDescriptionHorizontaux").html('') ;	
	$.getJSON("json/"+grille+".json",function(data){
		nomGrille = grille ;
		grilleJson = data ;
		grilleProposition = initTabGrille(grilleJson) ;
		grilleReponse = initTabGrille(grilleJson) ;
		initGrilleReponse(grilleJson) ;
		initGrilleProposition() ;
		loadGrille() ;
		drawGrille(grilleProposition) ;
		saveLastGrille() ;
	}) ;	
}

function initTabGrille(grille) {
	var tab = new Array() ;
	var i , j ;
	for ( i = 0 ; i < grille.grille.hauteur+1 ; i++ ){
		tab[i] = new Array() ;
		for ( j = 0 ; j < grille.grille.largeur+1 ; j++ ){
			tab[i][j] = -1 ;
		}		
	}
	return tab ;
}

function initGrilleReponse(grille) {
	var lgth, i ;

	$.each(grille.grille.mots_horizontaux, function(key, val){
		lgth = val.mot.length ;
		ajouterDecription("motCroiseDescriptionHorizontaux", key+1, val) ;
		for ( i = 0 ; i <  lgth ; i++ ) {
			if ( i == 0 ) {
				if (grilleReponse[val.origine.y][val.origine.x  + i -1] == -1 ) {
					grilleReponse[val.origine.y][val.origine.x  + i -1] = '' ;
				}
				grilleReponse[val.origine.y][val.origine.x  + i -1] += "<div class='descriptionHorizontal'>"+(key+1)+"&rarr;</div>" ;
			}
			grilleReponse[val.origine.y][val.origine.x  + i] = val.mot[i] ;
		}
	}) ;
	$.each(grille.grille.mots_verticaux, function(key, val){
		lgth = val.mot.length ;
		ajouterDecription("motCroiseDescriptionVerticaux", key+1, val) ;
		for ( i = 0 ; i <  lgth ; i++ ) {
			if ( i == 0 ) {
				if ( grilleReponse[val.origine.y  + i -1][val.origine.x] == -1 ) {
					grilleReponse[val.origine.y  + i -1][val.origine.x] = '' ;					
				}
				grilleReponse[val.origine.y  + i -1][val.origine.x] += "<div class='descriptionVertical'>"+(key+1)+"&darr;</div>" ;
			}
			grilleReponse[val.origine.y  + i][val.origine.x] = val.mot[i] ;
		}
	}) ;
}

function initGrilleProposition(grille) {
	if ( grille ) {

	} else {
		$.each(grilleProposition, function(key, val)  {
		$.each(val, function(key2, val2)  {
			if ( grilleReponse[key][key2] != -1 ) {
				if ( grilleReponse[key][key2].length > 1 ) {
					grilleProposition[key][key2] = grilleReponse[key][key2] ;
				} else {
					grilleProposition[key][key2] = 0 ;
				}
			}
		}) ;
	}) ;
	}
}

function ajouterDecription(zoneId, num, mot ) {
	var desc ;
	switch(mot.description.type) {
		case "img" :
			desc = "<p>"+num+" : <img src='"+mot.description.contenu+"' alt='"+mot.mot+"'></p>" ;
			break ;
		default :
			desc = "<p>"+num+" : "+mot.description.contenu+"</p>" ;
			break ;
	}
	$("#"+zoneId).append(desc) ;
}

function validerGrille() {
	var res = true ;
	$.each(grilleProposition, function(key, val)  {
		$.each(val, function(key2, val2)  {
			if ( String(val2).toLowerCase() != String(grilleReponse[key][key2]).toLowerCase() && val2[0] != '<') {
				res = false ;
			} 
		}) ;
	}) ;
	return res ;
}

function drawGrille(grille) {
	$("#motCroiseGrille").html('') ;
	// $("#motCroiseGrille").append("<input id='clavierVirtuel' type='text'>") ;
	var tailleBorder = 1 ;
	var largeur = $(window).width() ;
	if (largeur > 992)
	{
		largeur /= 2 ;
	}
	var hauteur = $("#motCroiseGrille").height() ;
	var nbCaseLargeur = grille[0].length ;
	var nbCaseHauteur = grille.length ;
	var tailleCaseLargeur = (largeur-((nbCaseLargeur+1)*tailleBorder))/nbCaseLargeur ;
	// var tailleCaseHauteur = (hauteur-((nbCaseHauteur+1)*tailleBorder))/nbCaseHauteur ;
	// var tailleCase = (tailleCaseHauteur <= tailleCaseLargeur) ? tailleCaseHauteur : tailleCaseLargeur ;
	var tailleCase = tailleCaseLargeur ;
	if ( tailleCase < 10 ) {
		tailleCase = 10 ;
	}
	taillePolice = tailleCase ;
	var largeurGrille = nbCaseLargeur*(tailleCase+(2*tailleBorder)) ;
	var hauteurGrille = nbCaseHauteur*(tailleCase+(2*tailleBorder)) ;	

	$("#motCroiseGrille").css('width', largeurGrille+"px") ;
	$("#motCroiseGrille").css('height', hauteurGrille+"px") ;
	var i = 0;
	var fromAnim;
	$.each(grille, function(index_y, val) {
		$.each(val, function(index_x, val1) {
			if ( val1 != -1 ) {
				contenuCase = '' ;
				if ( val1 != 0 ) {
					contenuCase = val1 ;
				}
				var description = '' ;
				if (val1[0] =='<' ) {
					description = ' descriptionLigne' ;
				}
				i++;
				if (i%2==0)
					fromAnim = "fromLeft";
				else
					fromAnim = "fromRight";
				$("#motCroiseGrille").append("<div class='caseGrille"+description+" wow "+fromAnim+"' id='case-"+index_x+"-"+index_y+"' data-case-x='"+index_x+"' data-case-y='"+index_y+"'>"+contenuCase+"</div>") ;
				
				//Dessin des bordures
				var left = 1 , right = 0 , top = 1 , bottom = 0 ;
				if ( index_x +1 >= grille[0].length || grille[index_y][index_x+1] == -1 ) {
					right = 1 ;
				}
				if ( index_y +1 >= grille.length || grille[index_y+1][index_x] == -1 ) {
					bottom = 1 ;
				}

				if (val1[0] =='<' ) {
					if (val1.length > 50){
						$("#case-"+index_x+"-"+index_y+" .descriptionVertical, #case-"+index_x+"-"+index_y+" .descriptionHorizontal").css("line-height", tailleCase/2.1+"px") ;
					} else {
						$("#case-"+index_x+"-"+index_y).css("line-height", tailleCase+"px") ;
						$("#case-"+index_x+"-"+index_y+" .descriptionVertical, #case-"+index_x+"-"+index_y+" .descriptionHorizontal").css("height", "100%") ;
						$("#case-"+index_x+"-"+index_y+" .descriptionVertical, #case-"+index_x+"-"+index_y+" .descriptionHorizontal").css("line-height", tailleCase+"px") ;
					}
				}
				$("#case-"+index_x+"-"+index_y).css("border-width", top+"px "+right+"px "+bottom+"px "+left+"px ") ;
				$("#case-"+index_x+"-"+index_y).css("top", index_y*(tailleCase+tailleBorder)) ;
				$("#case-"+index_x+"-"+index_y).css("left", index_x*(tailleCase+tailleBorder)) ;			
			}
		});
	});
	$(".caseGrille").css("font-size", tailleCase+"px") ;
	$(".caseGrille").css("line-height", tailleCase+"px") ;
	$(".caseGrille").css("width", tailleCase+"px") ;
	// $("#clavierVirtuel").css("width", tailleCase+"px") ;
	$(".caseGrille").css("height", tailleCase+"px") ;
	// $("#clavierVirtuel").css("height", tailleCase+"px") ;
	$("#motCroiseDescription img").css({"max-height" : tailleCase*3.5+"px", "max-width" : tailleCase*3.5+"px"}) ;

	$(".descriptionVertical, .descriptionHorizontal").css("font-size", tailleCase/2.1+"px") ;
}

function showAnswer()
{
	if (typeof(localStorage) != 'undefined' ) {
		localStorage.removeItem(nomGrille);            
	}
	$.each(grilleProposition, function(key, val)  {
		$.each(val, function(key2, val2)  {
			if ( grilleReponse[key][key2] != -1 ) {
					grilleProposition[key][key2] = grilleReponse[key][key2] ;
			}
		}) ;
	});	
	drawGrille(grilleProposition) ;
	saveGrille() ;
}

function selectionCase(oThis) {
	if ( $(oThis).html()[0] != '<' ) {
		$(".caseSelected").removeClass('caseSelected') ;
		$(oThis).addClass("caseSelected") ;
		caseSelectedId = $(oThis).attr("id") ;
		if ( mobile ) {			
			toucheMobile() ;
		}
	}
}

function deplacement(x, y){
	var horiz = $("#"+caseSelectedId).attr("data-case-x") ;
	var vert = $("#"+caseSelectedId).attr("data-case-y") ;
	horiz = parseInt(horiz)+x ;
	vert = parseInt(vert)+y ;
	if ( vert < grilleReponse.length && horiz <= grilleReponse[0].length ) {
		if ( grilleReponse[vert][horiz] != -1 && grilleReponse[vert][horiz][0] != '<' ) {
			selectionCase($("#case-"+horiz+"-"+vert)) ;
		}
	}
}

function saveGrille() {
	if (typeof(localStorage) != 'undefined' ) {
		localStorage.setItem(nomGrille, JSON.stringify(grilleProposition));            
	}
}

function loadLastGrille() {
	if (typeof(localStorage) != 'undefined' ) {
        var item = localStorage.getItem("lastGrille") ;
        if ( item !== null ) {
			nomGrille = item ;
        } else {
        	nomGrille = defaultGrille ;
        }      
	}
}

function saveLastGrille() {
	if (typeof(localStorage) != 'undefined' ) {
		localStorage.setItem("lastGrille", nomGrille);            
	}
}

function loadGrille() {
	if (typeof(localStorage) != 'undefined' ) {
        var item = localStorage.getItem(nomGrille) ;
        if ( item !== null ) {
			grilleProposition =  $.parseJSON(item) ;
        }      
	}
}

function reinitGrille() {
	if (typeof(localStorage) != 'undefined' ) {
		localStorage.removeItem(nomGrille);            
	}
	initGrilleProposition() ;
	drawGrille(grilleProposition) ;
	saveGrille() ;
}

function afficheGagne() {
	quitteGagne() ;
	var affiche = "<div id='grilleGagne' class='wow fromLeft'><div id='quitteGagne'>X</div><h2>Vous avez gagné !</h2><img src='img/gagne.jpg' alt='gagne'></div>" ;
	$("body").append(affiche) ;
	$("img").load(function(){
		var padding = parseInt($("#grilleGagne").css("padding")) ;
		var hauteur = $("#grilleGagne").height()+2*padding ;
		var largeur = $("#grilleGagne").width()+2*padding ;
		var hauteurWindow= $(window).height() ;
		var largeurWindow= $(window).width() ;	

		var left = (largeurWindow/2)-(largeur/2) ;
		var top = (hauteurWindow/2)-(hauteur/2 )+$(document).scrollTop() ;
		$("#grilleGagne").css("left",left+"px") ;
		$("#grilleGagne").css("top" , top+"px") ;
	}) ;

}

function quitteGagne() {
	
	$("#grilleGagne").remove() ;
}

function toucheMobile(){
	var scrollVal = $(document).scrollTop();
	var scrollValLeft = $(document).scrollLeft();
	var lettre = prompt("Entrez une lettre : ") ;	
	if ( lettre != null ){		
		if ( lettre.length > 1){
			lettre = lettre[0] ;
		}
		if ( !isLettre(lettre) ) {
			$("#"+caseSelectedId).text('') ;
			grilleProposition[$("#"+caseSelectedId).attr("data-case-y")][$("#"+caseSelectedId).attr("data-case-x")] = 0 ;
		} else {
			$("#"+caseSelectedId).text(lettre) ;
			grilleProposition[$("#"+caseSelectedId).attr("data-case-y")][$("#"+caseSelectedId).attr("data-case-x")] = lettre ;
		}
		
		saveGrille() ;
		if ( validerGrille() ) {
			afficheGagne() ;
		}
	}
	setTimeout(function(){
		$(document).scrollTop(scrollVal).scrollLeft(scrollValLeft) ;
	},500) ;
}

function isLettre(lettre){
	return /[a-zA-Z]/.test(lettre) ;
}