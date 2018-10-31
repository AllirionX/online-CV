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
	



function throttled(delay, fn) {
  let counter = 0;
  return function (...args) {
	
    counter++;
    if (counter < delay) {
      return;
    }
    counter = 0;
    return fn(...args);
  }
}

//Hub animation
var position;

function doBefore(i,panels) {
	scrolling = true;
	changeStart = false;
	changeEnd = false;
	var scrollType, topDuration, leftDuration;
	scrollDestination = $.scrollify.current().eq(0);
	scrollDestinationPosition = getPositionInPage(scrollDestination[0]);
	if(scrollDestination[0] != scrollOrigin[0]) {
		if(scrollDestinationPosition.top < scrollOriginPosition.top) {
			//scrolling up
			subHubTopText.append($(scrollDestination).data("hub-text"));
			subHubBottomText.append($(scrollOrigin).data("hub-text"));
			if($(scrollDestination).data("hub-text-css") != undefined) {
				subHubTopText.css($(scrollDestination).data("hub-text-css")[0]);
			}
			if($(scrollOrigin).data("hub-text-css") != undefined) {
				subHubBottomText.css($(scrollOrigin).data("hub-text-css")[0]);
			}
			scrollType = $(scrollDestination).data("hub-scroll-up");
			topDuration = 800;
			leftDuration = 400;
		} else {
			//scrolling down
			subHubTopText.append($(scrollOrigin).data("hub-text"));
			subHubBottomText.append($(scrollDestination).data("hub-text"));
			if($(scrollOrigin).data("hub-text-css") != undefined) {
				subHubTopText.css($(scrollOrigin).data("hub-text-css")[0]);
			}
			if($(scrollDestination).data("hub-text-css") != undefined) {
				subHubBottomText.css($(scrollDestination).data("hub-text-css")[0]);
			}
			scrollType = $(scrollDestination).data("hub-scroll-down");
			topDuration = 900;
			leftDuration = 300;
		}
		if(i==0) {
			$('.home').removeClass("scrolling");
		} else {
			$('.home').addClass("scrolling");
		}
		
		/*if($(scrollOrigin).data("hub-class") != undefined) {
			$(hub).removeClass($(scrollOrigin).data("hub-class"));
		}
		if($(scrollDestination).data("hub-class") != undefined) {
			$(hub).addClass( $(scrollDestination).data("hub-class"));
		}*/
		$(hub).addClass("scrolling");
		var hubPositionerPosition = getPositionInPage($(scrollDestination).find(".hub-positioner")[0]);
		if(scrollType === "top") {
			$( "#hub" ).animate({
				top:hubPositionerPosition.top,
			  }, { duration: 1200, easing: "easeInOutCubic", queue: false});	
		} else if (scrollType === "top left") {
			$( "#hub" ).animate({
			top:hubPositionerPosition.top,
			  }, { duration: topDuration +100, easing: "easeInOutCubic", queue: false, complete: function() {
				
				$( "#hub" ).animate(
					{
						left:hubPositionerPosition.left,
					}, 
					{ duration: leftDuration-100, easing: "easeInOutCubic", queue: false }
				 );
			  }});
		} else if (scrollType === "left top") {
			$( "#hub" ).animate({
				left:hubPositionerPosition.left,
			  }, { duration: leftDuration, queue: false, easing: "easeInOutCubic", complete: function() {
				  
					$( "#hub" ).animate(
					{
						top:hubPositionerPosition.top,
					}, 
					{ duration: topDuration, easing: "easeInOutCubic", queue: false }
				 );
			  }});
		}
		
		
			
	}
	
	
}

function doAfter(i,panels) {
	scrolling = false;
	subHubTopText.empty();
	subHubTopText.removeAttr("style");
	subHubBottomText.empty();
	subHubBottomText.removeAttr("style");
	
	
	scrollOrigin = scrollDestination;
	scrollOriginPosition = getPositionInPage(scrollOrigin[0]);
}

function doStep() {
	if(!changeEnd) {
		position = getPositionInPage(hub);		
		colorReset = null;
		isTopIn = position.top >= scrollDestinationPosition.top && position.top <= scrollDestinationPosition.bottom;
		isBottomIn = position.bottom >= scrollDestinationPosition.top && position.bottom <= scrollDestinationPosition.bottom;
		if(isTopIn && isBottomIn) {
			resetHub();
			return;
		} else if(isTopIn) {
			changeStart = true;
			Y = scrollDestinationPosition.bottom;
			divideHub(Y);
			
			if(changeStart && !changeColor) {
				colorTop = scrollDestination.data("hub-color");
				colorBottom = scrollOrigin.data("hub-color");
				colorHub(colorTop,colorBottom);
			}
			
		} else if (isBottomIn) {
			changeStart = true;
			Y = scrollDestinationPosition.top;
			divideHub(Y);
			
			if(changeStart && !changeColor) {
				colorTop = scrollOrigin.data("hub-color");
				colorBottom = scrollDestination.data("hub-color");
				colorHub(colorTop,colorBottom);
			}
		}
		
		
	}
}

function colorHub(colorTop,colorBottom) {
	$(subHubTop).css("background-color",colorTop);
	$(subHubBottom).css("background-color",colorBottom);
	changeColor = true;
}

function divideHub(Y) {
	if(Y<=position.bottom && Y>=position.top) {
		updateY(position,Y);
	}
	return;
}

function resetHub() {
	if(changeStart && !changeEnd) {
		if(scrollDestination != null) {
			$(hub).css("background-color",$(scrollDestination).data("hub-color"));
			hubText.empty();
			hubText.removeAttr("style");
			hubText.append($(scrollDestination).data("hub-text"));
			if($(scrollDestination).data("hub-text-css") != undefined) {
				hubText.css($(scrollDestination).data("hub-text-css")[0]);
			}
		}
		subHub.each(function() {
			$(this).css("height","0px");
		});
		changeEnd= true;
		changeColor = false;
		Y = null;
		$('#hub').removeClass("scrolling");
	}
}

function updateY(position, Y) {
	var topHeight = Y - position.top;
	var bottomHeight = position.bottom - Y;
	subHubTop.css("height",topHeight+"px");
	subHubBottom.css("height",bottomHeight+"px");
}

function getPositionInPage(el) {
	var positionInWindow = el.getBoundingClientRect();
	
	return {top : positionInWindow.top + window.scrollY, bottom : positionInWindow.bottom + window.scrollY, left : positionInWindow.left + window.scrollX, right : positionInWindow.right + window.scrollX}
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
		doStep();
		doAfter();
    }, 100);
    //Init scrollify
  $.scrollify({
	section : ".section",
	scrollSpeed: 1200,
	easing:"easeInOutCubic",
	setHeights:true,
	scrollbars:true,
	step : throttled(0, doStep),
	before: doBefore,
	after: doAfter
  });

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


