import AuthenticationService from '../services/authentication';
import RegistrationController from '../controllers/registration';
import UserModel from '../models/user';

/**
 * Handles the sign up button press.
 */
export default function Registration(ctx, next) {
    new RegistrationController({ authenticationService: new AuthenticationService(), UserModel: UserModel });

    next();
}