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

function doBefore(origin, destination, direction) {
	
	//hide hub-content*/
	$(".fp-section.active").find(".hub-content");
	
	if(destination==1) {
		$('.home, .mobile-section-title').removeClass("scrolling");
	} else {
		$('.home, .mobile-section-title').addClass("scrolling");
	}
	
	if(origin !== undefined && $(window).width() < 992) {
		$('.mobile-section-title ul li').removeClass("active");
		$(".mobile-section-title ul li:nth-child("+(destination)+")").addClass("active");
		$('.mobile-section-title ul').css({transform: 'translate(0px, -'+(destination-1)*70+'px)'});
	}
	$(".fp-section:nth-child("+(destination)+")").find(".hub-content").addClass("in");
}

$(document).ready(function(){
  
  //Loading screen
  if(window.location.hash) {
      var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      var loadercolor = $("[data-anchor="+hash+"]").find(".hub-content").css("background-color");
	  var backgroundcolor = $("[data-anchor="+hash+"]").css("background-color");
	  document.documentElement.style.setProperty('--loader-color', loadercolor);
	  document.documentElement.style.setProperty('--loader-background-color', backgroundcolor);
  }
  $('body').addClass('load');
 
  setTimeout(function(){
        $('body').addClass('loaded');
		setTimeout(function(){
			$('body').removeClass('load');
		}, 500);
    }, 4000);
	
    //Init fullpage
	$('#fullpage, #hub').fullpage({
		//options here,
		scrollOverflow:true,
		autoScrolling:true,
		responsiveWidth: 768,
		onLeave: function(origin, destination, direction){
			doBefore(origin, destination, direction);
		}
	});
  
    //Burger menu interaction
	$(document).on('click', function(event) {
		var target = $(event.target);
		if(parseInt($(window).width()) < 992 && $('.menu input').is(':checked') && (target.parents('.menu').length === 0  || target.hasClass('sublayer'))) {
			hide_menu();
		}	
	});
	$(document).on('scroll', function(event) {
		if (parseInt($(window).width()) < 992) {
			hide_menu();
		}
	});
	
	//Menu links
	$("a[href^='#']").click(function(e){
		if(parseInt($(window).width()) < 992) {
			hide_menu();
		}
	});
	
	//Adjust section height after adding content
	$('.panel-collapse').on('shown.bs.collapse hidden.bs.collapse', function() {
	  if(parseInt($(window).width()) >= 768) {
			$.fn.fullpage.reBuild();
		}
	});
});


