import CarmsInterviewController from '../controllers/carms-interview';
import AuthenticationService from '../services/authentication';

export default function CarmsInterview(ctx, next) {
	new CarmsInterviewController(new AuthenticationService());
	next();
}