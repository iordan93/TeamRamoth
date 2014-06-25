"use strict";
$(function(){

    windowRefresh();

	$(window).on('resize',function(){
		windowRefresh();
	});

	
    



});

function windowRefresh(){
	// functionality on window refresh

	// fix tabs text
	$("ul.tabs li").each(function(){
		var anchor=$(this).find("a");
		var span=anchor.find("span");

		span.css({
			'top':(anchor.outerHeight()-span.outerHeight())/2,
			'left':(anchor.outerWidth()-span.outerWidth())/2,
		});
	});
}