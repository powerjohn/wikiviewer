(function(){

	var searchBox=$('.searchBox'),
	close= $('.close'),
	handle = $('.handle'),
	search = $('.search'),
	title;

	$.ajaxSetup({
		url: 'https://en.wikipedia.org/w/api.php?',
				dataType: 'jsonp'
	});
	
	searchBox.on('click',function(){
		$(this).addClass("expanded");
		close.css('opacity', 1);
		handle.css('opacity', 0);
		//console.log($(this).children());
	});


	close.on('click', function(e){
		e.stopPropagation();
		$(this)
		.prev()
		.removeClass("expanded")
		.next().css('opacity', 0);
		handle.css('opacity', 1);
		searchBox.val("");
		$('.post').remove();
		console.log("closed");
	});

		var getTitle=function(){
			var dfd = $.Deferred();
			searchBox.on('keypress', function(e){
				if(e.which === 13){
					title = searchBox.val();
					console.log("title: "+title);
				}
				dfd.resolve();
			});
			
			return dfd.promise();
		};
		
				

		$.searchWiki = function(search){
			$.ajax({
				data:{
				format: 'json',
				action: 'query',
				generator: 'search',
				gsrnamespace: 0,
				gsrsearch: search,
				gsrlimit: 10,
				prop: 'extracts', 
				exintro: true,
				explaintext: true,
				exsentences: 1,
				exlimit: 'max'},
				success: function(results){
					$.each(results['query']['pages'], function(index, value){
						console.log(index);
						console.log(value);
						$('<article></article>',{
							class:"post",
							id: index
						}).appendTo('.row');
						$('<a></a>',{
							id:'wikiLink' + index,
							href: 'http://en.wikipedia.org/?curid='+index,
							target: '_blank'
						}).appendTo('#'+index);
						$('<h3></h3>',{
							class:'wikiTitle',
							text: value.title
						}).appendTo('#wikiLink'+index);
						$('<span></span>',{
							class:'wikiextract',
							text: value.extract
						}).appendTo('#wikiLink'+index);
					});
					
				}
			});
		};

		getTitle().done(function(){
			search.on('submit', function(e){
			e.preventDefault();
			$.searchWiki(title);
			});
		});
		

	searchBox.autocomplete({
    source: function(request, response) {
        $.ajax({
            data: {
                'action': "opensearch",
                'format': "json",
                'search': request.term
            },
            success: function(data) {
                response(data[1]);
            }
        });
    }
});

})();