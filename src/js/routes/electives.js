import ElectivesController from '../controllers/electives';
import AuthenticationService from '../services/authentication';

export default function Electives(ctx, next) {
	new ElectivesController(new AuthenticationService());
	next();
}