"use strict";
$(function(){

    windowRefresh();

	$(window).on('load resize',function(){
		windowRefresh();
	});

	// change view of images 
	$(".view-choice a").click(function(e){

		$(".tabs-content ul").removeClass("list-view");
		$(".tabs-content ul").removeClass("grid-view");

		$(".tabs-content ul").addClass($(this).attr("class")+"-view");

		centerImages();

		e.preventDefault();
	});
	

	// toggle images categories
	$("ul.tabs li a").click(function(e){

		var li=$(this).parent("li");
		li.addClass("current").siblings().removeClass("current");

		if(li.hasClass("all")){
			$(".tabs-content ul li").each(function(){
				$(this).fadeIn("slow");
			});
		}

		if(li.hasClass('when-you')){
			$(".tabs-content ul li.cat-1").fadeIn("slow").siblings().hide();
		}

		if(li.hasClass('memes')){
			$(".tabs-content ul li.cat-2").fadeIn("slow").siblings().hide();
		}

		if(li.hasClass('it-life')){
			$(".tabs-content ul li.cat-3").fadeIn("slow").siblings().hide();
		}

		windowRefresh();
		e.preventDefault();

	});

	// css transition of social icons and likes buttons
	$("ul.socials li a").hover(function(){
		$(this).transition({ rotate: '45deg' });
	},function(){
		$(this).transition({ rotate: '0deg' });
	});

	$(".likes>a").hover(function(){
		$(this).find("span").transition({scale:1.4});
	},function(){
		$(this).find("span").transition({scale:1.0});
	})
	// put random values for likes and dislikes

	$(".likes>a").each(function(){
		$(this).find("span").html(parseInt(Math.random()*200));
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

	

	$(".team ul li").each(function(){
		var img=$(this).find("img");

		img.css({
			'height':img.width()
		});
	})


	centerImages();

}

function centerImages(){
	// center grid images
	$("ul.grid-view li").each(function(){

		var anchor=$(this).find(">a");
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

		var anchor=$(this).find(">a");
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