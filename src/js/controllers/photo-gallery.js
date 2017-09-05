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
					method: 'flickr.interestingness.getList',
					api_key: '7617adae70159d09ba78cfec73c13be3' // jshint ignore:line
				},
				dataType: 'jsonp',
				jsonp: 'jsoncallback'
			}).done(function (result) {
				var carouselLinks = []
				var linksContainer = $('#links')
				var baseUrl
				// Add the demo images as links with thumbnails to the page:
				$.each(result.photos.photo, function (index, photo) {
					baseUrl = 'https://farm' + photo.farm + '.static.flickr.com/' +
						photo.server + '/' + photo.id + '_' + photo.secret
					$('<a/>')
						.append($('<img>').prop('src', baseUrl + '_s.jpg'))
						.prop('href', baseUrl + '_b.jpg')
						.prop('title', photo.title)
						.attr('data-gallery', '')
						.appendTo(linksContainer)
					carouselLinks.push({
						href: baseUrl + '_c.jpg',
						title: photo.title
					})
				})
				// Initialize the Gallery as image carousel:
				blueimp.Gallery(carouselLinks, {
					container: '#blueimp-image-carousel',
					carousel: true
				})
			});
});
		
		
	}
	
	
	
}