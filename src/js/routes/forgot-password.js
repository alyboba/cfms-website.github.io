import ForgotPasswordController from '../controllers/forgot-password';
import AuthenticationService from '../services/authentication';

export default function members(ctx, next) {
    new ForgotPasswordController({ authenticationService: new AuthenticationService() });

    next();
}
