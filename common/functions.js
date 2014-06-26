"use strict";
$(function(){

    windowRefresh();

	$(window).on('resize',function(){
		windowRefresh();
	});

	$(".view-choice a").click(function(e){

		$(".tabs-content ul").removeClass("list-view");
		$(".tabs-content ul").removeClass("grid-view");

		$(".tabs-content ul").addClass($(this).attr("class")+"-view");

		centerImages();

		e.preventDefault();
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

	
	centerImages();
}

function centerImages(){
	// center grid images
	$("ul.grid-view li").each(function(){

		var anchor=$(this).find("a");
		var img = anchor.find("img");
		anchor.css({
			'height':200
		});

		img.css({
			'top':(anchor.outerHeight()-img.outerHeight())*0.5,
			'left':(anchor.outerWidth()-img.outerWidth())*0.5
		});

	});

	$("ul.list-view li").each(function(){

		var anchor=$(this).find("a");
		var img = anchor.find("img");
		anchor.css({
			'height':img.outerHeight()
		});

		img.css({
			'top':0,
			'left':0
		});

	});
}