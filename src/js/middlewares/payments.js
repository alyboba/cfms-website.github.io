import PaymentsController from '../controllers/payments';
import PaymentsService from '../services/payments';
import AuthenticationService from '../services/authentication';

export default function(ctx, next) {
    new PaymentsController({ authenticationService: new AuthenticationService(), paymentsService: new PaymentsService() });

    next();
}