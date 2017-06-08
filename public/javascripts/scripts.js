$(document).ready(function(){
	
	$('.go-button').click(function(){
		$('.page1').css({
			'top':'-100vh'
		});
		$('.page2').css({
			'top':'0vh'
		});
	});

	$('.go-back').click(function(){
		$('.page1').css({
			'top':'0vh'
		});
		$('.page2').css({
			'top':'200vh'
		});
	});

	$('.carousel').carousel({
		interval: false
	});

	$('.profile').load('profile.ejs');

});