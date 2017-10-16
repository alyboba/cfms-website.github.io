import MeetingMinutesController from '../controllers/meeting-minutes';
import AuthenticationService from '../services/authentication';
import ModalController from '../controllers/showModal';


//Shows Member Account Information on the Members Page
export default function meetingMinutes(ctx, next) {
	new MeetingMinutesController(new AuthenticationService(), ModalController);
	
	next();
}