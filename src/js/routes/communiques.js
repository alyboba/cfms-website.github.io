import CommuniquesController from '../controllers/communiques';
import AuthenticationService from '../services/authentication';


//Shows Member Account Information on the Members Page
export default function Communiques(ctx, next) {
	new CommuniquesController(new AuthenticationService());
	
	next();
}
