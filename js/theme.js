'use strict';

$(function() { 

})
var changeStart,changeEnd, changeColor;
var coloredDiv = null;
var hub = null;
var Y,colorTop,colorBottom,colorRest,topleft,topright,bottomleft,bottomright,subHubTop,subHubBottom,subHub,hubText,subHubTopText,subHubBottomText;
var scrolling, scrollDestination, scrollDestinationPosition, scrollOrigin, scrollOriginPosition;
var colorReset, isTopIn, isBottomIn;

function init_animation_vars(){
	coloredDiv = $("div[data-hub-color],header[data-hub-color],footer[data-hub-color]");
	hub = document.getElementById("hub");
	topleft = $("#hub .top.left").eq(0);
	topright = $("#hub .top.right").eq(0);
	bottomleft = $("#hub .bottom.left").eq(0);
	bottomright = $("#hub .bottom.right").eq(0);
	subHubTop = $("#hub .top");
	subHubBottom = $("#hub .bottom");
	subHubTopText = $("#hub .top span");
	subHubBottomText = $("#hub .bottom span");
	subHub = $("#hub div:not(.hub-text)");
	hubText = $("#hub div.hub-text span");
	changeStart = false;
	changeEnd = true;
	changeColor = false;
	scrollOrigin = $("header[data-hub-color]").eq(0);
	scrollOriginPosition = getPositionInPage(scrollOrigin[0]);
}

//Menu interaction
function show_hide_menu(){
	if ($('.menu input').is(':checked')){
		hide_menu();
	}else{
		show_menu();
	}
}

function hide_menu() {
	$('.menu input').prop('checked', false);
}
function show_menu() {
	$('.menu input').prop('checked', true);
}

function resetHubPositioner() {
	var el = $($.scrollify.current().eq(0)).find(".hub-positioner-wrapper")[0];
	var hubPositionerPosition = getPositionInPage(el);
	var leftCorner = hubPositionerPosition.left;
		var halfTopCorner = hubPositionerPosition.top+(el.offsetHeight/2);
		var halfLeftCorner = hubPositionerPosition.left+(el.offsetWidth/2);
		var bottomCorner = hubPositionerPosition.top+el.offsetHeight;
		var rightCorner = hubPositionerPosition.left+el.offsetWidth;
		var topCorner = hubPositionerPosition.top;
		$( "#hub" ).css("transition", "clip-path 0.1s");
		$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+bottomCorner+"px, "+rightCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+ topCorner+"px)");
}

//Hub animation
var position;

function doBefore(i,panels) {
	scrolling = true;
	changeStart = false;
	changeEnd = false;
	
	if(i==0) {
		$('.home, .mobile-section-title').removeClass("scrolling");
	} else {
		$('.home, .mobile-section-title').addClass("scrolling");
	}
	if(i !== undefined && $(window).width() < 992) {
		$('.mobile-section-title ul li').removeClass("active");
		$(".mobile-section-title ul li:nth-child("+(i+1)+")").addClass("active");
		$('.mobile-section-title ul').css({transform: 'translate(0px, -'+i*70+'px)'});
	}

	$(hub).addClass("scrolling");
	
	//Hub animation
	var scrollType, topDuration, leftDuration;
	scrollDestination = $.scrollify.current().eq(0);
	scrollDestinationPosition = getPositionInPage(scrollDestination[0]);
	var scrollTop = scrollDestinationPosition.top < scrollOriginPosition.top;
		if(scrollTop) {
			//scrolling up
			scrollType = $(scrollDestination).data("hub-scroll-up");
			topDuration = 0.8;
			leftDuration = 0.4;
		} else {
			//scrolling down
			scrollType = $(scrollDestination).data("hub-scroll-down");
			topDuration = 0.8;
			leftDuration = 0.4;
		}
		
		var el =$(scrollDestination).find(".hub-positioner-wrapper")[0]
		var hubPositionerPosition = getPositionInPage(el);
		
		var leftCorner = hubPositionerPosition.left;
		var halfTopCorner = hubPositionerPosition.top+(el.offsetHeight/2);
		var halfLeftCorner = hubPositionerPosition.left+(el.offsetWidth/2);
		var bottomCorner = hubPositionerPosition.top+el.offsetHeight;
		var rightCorner = hubPositionerPosition.left+el.offsetWidth;
		var topCorner = hubPositionerPosition.top;
		
		var elOrigin =$(scrollOrigin).find(".hub-positioner-wrapper")[0]
		var hubPositionerPositionOrigin = getPositionInPage(elOrigin);
		
		var leftCornerOrigin = hubPositionerPositionOrigin.left;
		var halfTopCornerOrigin = hubPositionerPositionOrigin.top+(el.offsetHeight/2);
		var halfLeftCornerOrigin = hubPositionerPositionOrigin.left+(el.offsetWidth/2);
		var bottomCornerOrigin = hubPositionerPositionOrigin.top+el.offsetHeight;
		var rightCornerOrigin = hubPositionerPositionOrigin.left+el.offsetWidth;
		var topCornerOrigin = hubPositionerPositionOrigin.top;
		var easing = "ease";
		if($(window).width() >= 992) {
			if(scrollType === "top") {
				if(scrollTop) {
					easing = "ease-in";
				}
				$( "#hub" ).css("transition", "clip-path 1.2s "+easing);
				$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+bottomCorner+"px, "+rightCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+ topCorner+"px)");
		
			} else if (scrollType === "top left") {
				easing = "ease-in";
				$( "#hub" ).css("transition", "clip-path "+topDuration+"s "+easing);
				$( "#hub" ).css("clip-path","polygon("+leftCornerOrigin+"px "+halfTopCorner+"px, "+halfLeftCornerOrigin+"px "+bottomCorner+"px, "+rightCornerOrigin+"px "+halfTopCorner+"px, "+halfLeftCornerOrigin+"px "+ topCorner+"px)");
				setTimeout(function(){
					easing = "ease-in-out";
					$( "#hub" ).css("transition", "clip-path "+leftDuration+"s "+easing);
					$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+bottomCorner+"px, "+rightCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+ topCorner+"px)");
				}, topDuration * 1000);
			} else if (scrollType === "left top") {
				if(scrollTop) {
					easing = "ease";
				}
				$( "#hub" ).css("transition", "clip-path "+leftDuration+"s "+easing);
				$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCornerOrigin+"px, "+halfLeftCorner+"px "+bottomCornerOrigin+"px, "+rightCorner+"px "+halfTopCornerOrigin+"px, "+halfLeftCorner+"px "+ topCornerOrigin+"px)");
				setTimeout(function(){
					if(scrollTop) {
						easing = "ease";
					}
					$( "#hub" ).css("transition", "clip-path "+topDuration+"s "+easing);
					$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+bottomCorner+"px, "+rightCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+ topCorner+"px)");
				}, leftDuration * 1000);			
			}
		} else {
			$( "#hub" ).css("transition", "clip-path 1.2s "+easing);
			$( "#hub" ).css("clip-path","polygon("+leftCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+bottomCorner+"px, "+rightCorner+"px "+halfTopCorner+"px, "+halfLeftCorner+"px "+ topCorner+"px)");
		}

	
	
}

function doAfter(i,panels) {	
	scrollOrigin = scrollDestination;
	scrollOriginPosition = getPositionInPage(scrollOrigin[0]);
}

function getPositionInPage(el) {
	var positionInWindow = el.getBoundingClientRect();
	return {top : positionInWindow.top + window.scrollY, bottom : positionInWindow.bottom + window.scrollY, left : positionInWindow.left + window.scrollX, right : positionInWindow.right + window.scrollX}
}

function initSubhubs() {
	coloredDiv.each(function(){
		$("#hub").append("<div data-section="+$(this).data("section-name")+" class='subhub' style='background-color:"+$(this).data("hub-color")+"; height:"+this.offsetHeight+"px;'></div>");
	});
}

function resizeSubhubs() {
	coloredDiv.each(function(){
		$("div[data-section='"+$(this).data("section-name")+"']").eq(0).css("height", this.offsetHeight+"px");
	});
}

$(document).ready(function(){
  //Init vars 
  init_animation_vars();
  
  //Loading screen
  $('body').addClass('load');
  
  setTimeout(function(){
		$('body').removeClass('load');
        $('body').addClass('loaded');
		changeStart=true;
		changeEnd=false;
		doBefore();
		doAfter();
    }, 4000);
    //Init scrollify
  $.scrollify({
	section : ".section",
	scrollSpeed: 1200,
	easing:"easeInOutCubic",
	afterResize:function() {
		resetHubPositioner();
		resizeSubhubs();
		$.scrollify.move($.scrollify.currentIndex());
	},
	setHeights:true,
	scrollbars:true,
	before: doBefore,
	after: doAfter
  });

  $.scrollify.move('#home');
  initSubhubs();
  //Burger menu and interaction
	$(document).on('click', function(event) {
		var target = $(event.target);
		if(parseInt($(window).width()) < 768 && $('.menu input').is(':checked') && (target.parents('.menu').length === 0  || target.hasClass('sublayer'))) {
			hide_menu();
		}	
	});
	$(document).on('scroll', function(event) {
		if (parseInt($(window).width()) < 768) {
			hide_menu();
		}
	});
	//Menu links
	$("a[href^='#']").click(function(e){
		var target = $(this);
		e.preventDefault();
		if(parseInt($(window).width()) < 768) {
			hide_menu();
		}
		$.scrollify.move(target.attr("href"));
	});
});


