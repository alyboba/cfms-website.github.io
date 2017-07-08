/**
 * Created by Justin on 7/8/2017.
 */
import PaginationController from '../controllers/pagination';

//Shows Member Account Information on the Members Page
export default function modal(ctx, next) {
	new PaginationController();
	
	next();
}