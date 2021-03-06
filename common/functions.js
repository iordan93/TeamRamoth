"use strict";
$(function () {
    var cache = {};

    $.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
          cache[str] = cache[str] ||
            tmpl(document.getElementById(str).innerHTML) :

          // Generate a reusable function that will serve as a template
          // generator (and which will be cached).
          new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%").join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t").join("');")
              .split("%>").join("p.push('")
              .split("\r").join("\\'")
          + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };

    window.data = [];
    loadData("data/data.js");
    var memes = "";
    for (var i in window.data) {
        memes += $.tmpl("itemTemplate", window.data[i]);
    }

    $(".grid-view").html(memes);

    windowRefresh();

    $(window).on('load resize', function () {
        windowRefresh();
    });

    // change view of images 
    $(".view-choice a").click(function (e) {
        var viewType = $(this).attr("class") + "-view";
        setCurrentViewType(viewType);
        windowRefresh();
        e.preventDefault();
    });


    $(".likes>a").fancybox({
        'padding':0,
        'centerOnScroll'    : true,
        'overlayOpacity'    : 0.85,
        'overlayColor'      : '#333'
    });


    // toggle images categories
    $("ul.tabs li a").click(function (e) {
        var li = $(this).parent("li");
        li.addClass("current").siblings().removeClass("current");

        if (li.hasClass("all")) {
            displayItemsFromCategory("all");
        }
        else {
            var category = li.prop("class")
                .split(" ")
                .filter(function (cat) {
                    return cat !== "current"
                })[0];
            displayItemsFromCategory(category);
        }

        setCurrentCategory(category);

        windowRefresh();
        e.preventDefault();
    });

    // css transition of social icons and likes buttons
    $("ul.socials li a").hover(function () {
        $(this).transition({ rotate: '45deg' });
    }, function () {
        $(this).transition({ rotate: '0deg' });
    });

    $(".likes>a").hover(function () {
        $(this).find("span").transition({ scale: 1.4 });
    }, function () {
        $(this).find("span").transition({ scale: 1.0 });
    })

    $(".tabs-content ul.grid-view li>a").click(function (e) {
        if(!$(this).parent("li").parent("ul").hasClass("list-view")){
            var element = $(e.target);
            //if (!element.hasClass("like") && !element.hasClass("dislike")) {
                displaySingleItem(e);
            //}
        }

        e.preventDefault();
    });

    $(".tabs-content a.backButton").click(function (e) {
        windowRefresh();
        e.preventDefault();
    });

    // put random values for likes and dislikes
    //$(".likes>a").each(function () {
    //    $(this).find("span").html(parseInt(Math.random() * 200, 10));
    //});
});

function windowRefresh() {
    // functionality on window refresh
    displayItemsFromCategory(getCurrentCategory());

    // fix tabs text
    $("ul.tabs li").each(function () {
        var anchor = $(this).find("a");
        var span = anchor.find("span");

        span.css({
            'top': (anchor.outerHeight() - span.outerHeight()) / 2,
            'left': (anchor.outerWidth() - span.outerWidth()) / 2,
        });
    });
    
    $(".tabs-content a.backButton").hide();



    displayViewType();


}

function centerImages() {
    // center grid images
    $("ul.grid-view li").each(function () {

        var anchor = $(this).find(">a");
        var img = anchor.find("img");
        anchor.css({
            'height': 200
        });

        img.css({
            'top': (anchor.outerHeight() - img.outerHeight()) * 0.5,
            'left': (anchor.outerWidth() - img.outerWidth()) * 0.5
        });

    });

    $("ul.list-view li").each(function () {

        var anchor = $(this).find(">a");
        var img = anchor.find("img");
        anchor.css({
            'height': img.outerHeight()
        });

        img.css({
            'top': 0,
            'left': 0
        });
    });
}

function loadData(url) {
    $.ajax({
        dataType: "json",
        url: url,
        async: false
    })
    .done(function (data) {
        window.data = data
    });
}

function getCurrentCategory() {
    return sessionStorage.getItem("currentCategory") || "all";
}

function setCurrentCategory(category) {
    sessionStorage.setItem("currentCategory", category || "all");
}

function getCurrentViewType() {
    return sessionStorage.getItem("viewType") || "grid-view";
}

function setCurrentViewType(viewType) {
    sessionStorage.setItem("viewType", viewType);
}

function displayItemsFromCategory(category) {
    category = category || "all";
    $("ul.tabs ." + category).addClass("current").siblings().removeClass("current");
    var items = $(".tabs-content ul li");
    if (category === "all") {
        items.each(function () {
            $(this).fadeIn("slow")
        });
    }
    else {
        items.filter(function (index, item) {
            return !$(item).hasClass(category);
        }).hide();
        items.filter(function (index, item) {
            return $(item).hasClass(category);
        }).fadeIn("slow");
    }
}

function displayViewType(type) {
    type = type || getCurrentViewType();
    $(".tabs-content ul").removeClass("list-view");
    $(".tabs-content ul").removeClass("grid-view");
    $(".tabs-content ul").addClass(type);

    centerImages();
    
    $('ul.grid-view li >a').unbind('click.fb')
    $("ul.list-view li >a").fancybox({
        'padding':0,
        'centerOnScroll'    : true,
        'overlayOpacity'    : 0.85,
        'overlayColor'      : '#333'
    });
}

function displaySingleItem(e) {
    displayViewType("list-view");
    $(e.currentTarget).parent("li").siblings().hide();
    $(".tabs-content a.backButton").show().css({'display':'block'});
}