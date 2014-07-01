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

        $(".tabs-content ul").removeClass("list-view");
        $(".tabs-content ul").removeClass("grid-view");

        $(".tabs-content ul").addClass($(this).attr("class") + "-view");

        centerImages();

        e.preventDefault();
    });


    // toggle images categories
    $("ul.tabs li a").click(function (e) {
        var li = $(this).parent("li");
        li.addClass("current").siblings().removeClass("current");

        if (li.hasClass("all")) {
            $(".tabs-content ul li").each(function () {
                $(this).fadeIn("slow");
            });
        }
        else {
            var category = li.prop("class")
                .split(" ")
                .filter(function (i) {
                    return i !== "current"
                })[0];
            var items = $(".tabs-content ul li");
            items.filter(function (index, item) {
                return !$(item).hasClass(category);
            }).hide();
            items.filter(function (index, item) {
                return $(item).hasClass(category);
            }).fadeIn("slow");
        }

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
    // put random values for likes and dislikes

    $(".likes>a").each(function () {
        $(this).find("span").html(parseInt(Math.random() * 200, 10));
    });

});

function windowRefresh() {
    // functionality on window refresh

    // fix tabs text
    $("ul.tabs li").each(function () {
        var anchor = $(this).find("a");
        var span = anchor.find("span");

        span.css({
            'top': (anchor.outerHeight() - span.outerHeight()) / 2,
            'left': (anchor.outerWidth() - span.outerWidth()) / 2,
        });
    });



    $(".team ul li").each(function () {
        var img = $(this).find("img");

        img.css({
            'height': img.width()
        });
    })


    centerImages();

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