import PhotoGalleryController from '../controllers/photo-gallery';

export default function TagSearch(ctx, next) {
	new PhotoGalleryController();
	
	next();
}