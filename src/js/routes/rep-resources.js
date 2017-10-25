import RepResourcesController from '../controllers/rep-resources';
import AuthenticationService from '../services/authentication';


//Shows Member Account Information on the Members Page
export default function meetingMinutes(ctx, next) {
	new RepResourcesController(new AuthenticationService());
	
	next();
}
