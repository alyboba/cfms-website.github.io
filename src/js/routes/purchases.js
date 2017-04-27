import PurchasesController from '../controllers/purchases';
import AuthenticationService from '../services/authentication';
import PaymentsService from '../services/payments';

export default function Purchases(ctx, next) {
    new PurchasesController({ authenticationService: new AuthenticationService(), paymentsService: new PaymentsService() });
    next();
}
