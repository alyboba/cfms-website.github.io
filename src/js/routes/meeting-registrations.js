import MeetingRegistrationsController from '../controllers/meeting-registrations';
import AuthenticationService from '../services/authentication';
import MeetingRegistrationRepository from '../repositories/firebase/meeting-registration';
import MeetingRegistrationModel from '../models/meeting-registration';
import UserRepository from '../repositories/api/user';
import UserModel from '../models/user';

//Shows Member Account Information on the Members Page
export default function members(ctx, next) {
    new MeetingRegistrationsController(new AuthenticationService(), new MeetingRegistrationRepository(MeetingRegistrationModel, new UserRepository(UserModel)));

    next();
}
