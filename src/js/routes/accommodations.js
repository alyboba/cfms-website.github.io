import AccommodationsController from '../controllers/accommodations';
import AuthenticationService from '../services/authentication';

export default function Accommodations(ctx, next) {
	new AccommodationsController(new AuthenticationService());
	next();
}