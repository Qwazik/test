$(function(){
	$('.js-mobile-btn').click(function(){
		$('.js-mobile-nav').toggleClass('main-header__nav-wrapper_active')
		$(this).toggleClass('mobile-nav-btn_active')
	});
});

$(function(){
	$('.js-anchor-link').click(function(){
		var target = $(this).attr('href');
		$('body, html').animate({
			scrollTop: $(target).offset().top
		},1000);
		$('.js-mobile-btn').click();
		return false;
	});
});