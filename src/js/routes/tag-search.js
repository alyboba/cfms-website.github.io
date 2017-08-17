import TagSearchController from '../controllers/tag-search';

//Shows Member Account Information on the Members Page
export default function TagSearch(ctx, next) {
	new TagSearchController();
	
	next();
}