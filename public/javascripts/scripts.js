$(document).ready(function(){
	
	$('.go-button').click(function(){
		$('.page1,.page2').css({
			'top':'100vh'
		});
	});
	$('.back-home').click(function(){
		$('.page1,.page2').css({
			'top':'0vh'
		});
	});

});