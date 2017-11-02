import MeetingMinutesController from '../controllers/meeting-minutes';
import AuthenticationService from '../services/authentication';
import DatabaseModel from '../models/meeting-minutes';


//Shows Member Account Information on the Members Page
export default function meetingMinutes(ctx, next) {
	new MeetingMinutesController(new AuthenticationService(), DatabaseModel);
	
	next();
}