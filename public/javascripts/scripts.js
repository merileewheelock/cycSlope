$(document).ready(function(){

	// $('.go-button').click(function(){
	// 	// $('.error').each(function(){
	// 	// 	$(this).html('');
	// 	// })
	// 	// $('.search-bar').each(function(){
	// 		if(($('#start-search').val()) || ($('#end-search').val()) == null){
	// 			$('.error').html("Please enter a start and end location")
	// 		}
	// 	// });
	// });

	var startLocation = $('#start-search').val();
	var endLocation = $('#end-search').val();
	console.log(startLocation);
	console.log(endLocation);
 	if (revisited == true){
		// $('.go-button').click(function(){
			// event.preventDefault();
			// var startLocation = $('#start-search').val();
			// var endLocation = $('#end-search').val();
			// console.log(startLocation);
			// console.log(endLocation);
		// });
		
		// $('.go-button').click(function(){
			$('.page1').css({
				'top':'-100vh'
			});
			$('.page2').css({
				'top':'0vh'
			});
		// });

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
	}
});