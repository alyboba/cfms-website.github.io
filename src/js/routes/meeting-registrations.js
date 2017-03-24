import MeetingRegistrationsController from '../controllers/meeting-registrations';
import AuthenticationService from '../services/authentication';
import MeetingRegistrationRepository from '../repositories/firebase/meeting-registration';
import MeetingRegistrationModel from '../models/meeting-registration';
import UserRepository from '../repositories/api/user';
import UserModel from '../models/user';
import PaymentsController from '../controllers/payments';
import PaymentsService from '../services/payments';

export default function MeetingRegistration(ctx, next) {
    if (ctx.params.meeting == 'view-registrations.html')
        new MeetingRegistrationsController(new AuthenticationService(), new MeetingRegistrationRepository(MeetingRegistrationModel, new UserRepository(UserModel)));
    else
        new PaymentsController({ authenticationService: new AuthenticationService(), paymentsService: new PaymentsService() });

    next();
}
