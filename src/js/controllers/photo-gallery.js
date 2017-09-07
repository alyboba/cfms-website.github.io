//This import order matters, don't change it or app could break.
import Helper from './dependencies/blueimp-helper';
import PhotoSwipe from './dependencies/blueimp-gallery';
import Fullscreen from './dependencies/blueimp-gallery-fullscreen';

export default class PhotoGalleryController{
	constructor() {
		this.process();
	}
		
	process() {
		$(document).ready(function(){
			// Load demo images from flickr:
			$.ajax({
				url: 'https://api.flickr.com/services/rest/',
				data: {
					format: 'json',
					photoset_id: '72157688716575875',
					user_id: '154596101@N02',
					method: 'flickr.photosets.getPhotos',
					//method: 'flickr.interestingness.getList',
					api_key: '2360ff92cabc49f59a9ceaa136a0fbcb'
					//api_key: '7617adae70159d09ba78cfec73c13be3' // jshint ignore:line blueimp Key
				},
				dataType: 'jsonp',
				jsonp: 'jsoncallback'
			}).done(function (result) {
				console.log(result);
				var carouselLinks = []
				var linksContainer = $('#links')
				var baseUrl
				
				// Add the demo images as links with thumbnails to the page:
				$.each(result.photoset.photo, function (index, photo) {
				//$.each(result.photos.photo, function (index, photo) {
					baseUrl = 'https://farm' + photo.farm + '.static.flickr.com/' +
						photo.server + '/' + photo.id + '_' + photo.secret
					$('<a/>')
						.append($('<img>').prop('src', baseUrl + '_s.jpg'))
						.prop('href', baseUrl + '_b.jpg')
						.prop('title', photo.title)
						.attr('data-gallery', '')
						.appendTo(linksContainer);
					carouselLinks.push({
						href: baseUrl + '_c.jpg',
						title: photo.title
					});
				});
				// Initialize the Gallery as image carousel:
				blueimp.Gallery(carouselLinks, {
					container: '#blueimp-image-carousel',
					carousel: true
				})
			});
			
			
			
			
			//Hooking up lightBox links to onclick function
			document.getElementById('links').onclick = function (event) {
				event = event || window.event;
				var target = event.target || event.srcElement,
					link = target.src ? target.parentNode : target,
					options = {index: link, event: event},
					links = this.getElementsByTagName('a');
				blueimp.Gallery(links, options);
			};
			
			
});
		
		
	}
	
	
	
}