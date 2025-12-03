$(document).ready(function() {
    
    $("#btnAnim").click(function() {
        var box = $("#doboz");

        box.css({opacity: 1, fontSize: '12pt', left: '0px', top: '0px', width: '150px'});


        box.animate({left: '300px', width: '300px', fontSize: '30pt'}, 1000)

           .animate({top: '200px', width: '150px', height: '+=10%'}, 1000)

           .animate({left: '0px', opacity: '0.4'}, 1000)

           .animate({top: '0px', opacity: '1', fontSize: '12pt', height: '100px'}, 1000, function() {
               alert("VÉGE");
           });
    });


    $("#btnHide").click(function() {
        $(".bekezdesek").hide();

        $("#doboz").animate({top: '-50px'}, 500); 
        alert("Bekezdések elrejtése");
    });


    $("#btnToggle").click(function() {
        $("#doboz").toggle(500, function() {

            if ($(this).is(':visible')) {
                $(this).animate({left: '+=100px'}, 500);
            }
        });
    });
});