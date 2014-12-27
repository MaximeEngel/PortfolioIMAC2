$(document).ready(function() {

    // Smooth scroll on click on
    $(".scrollTo").on('click', function(evt) {
        evt.preventDefault();
        $("body").animate({scrollTop : $($(this).attr("href")).offset().top - 50}, 500, 'swing');
    }) ;

    // Fade when scroll to good position
    var sections = $("[data-scrollspy]");
    var links = $("#mainMenu a");
    var linkSelections = links.map(function(){ //tableau
        var href = $(this).attr("href");
        return $(href);
    })

    $(document).on('scroll', function() {
        var posStart = $(document).scrollTop() + $(window).height() / 2 ;
        var current;
        $(linkSelections).each(function(){
            if($(this).offset().top < posStart)
                current = this ;
        });


        links.removeClass("active");
        links.filter("[href=#"+current[0].id+"]").addClass("active") ;
    }) ;
});