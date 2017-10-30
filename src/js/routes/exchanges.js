import ViewExchangePayments from '../controllers/view-exhange-payments';
import ExchangePaymentRepository from '../repositories/firebase/exchange-payments';
import ExchangePaymentModel from '../models/exchange-payment';
import UserRepository from '../repositories/api/user';
import UserModel from '../models/user';
import ExchangesController from '../controllers/exchanges';
import AuthenticationService from '../services/authentication';
import PaymentsService from '../services/payments';

export default function ExchangePayments(ctx, next) {
    if (ctx.params.exchange === 'view-payments.html')
        new ViewExchangePayments(new AuthenticationService(), new ExchangePaymentRepository(ExchangePaymentModel, new UserRepository(UserModel)));
    else
        new ExchangesController({ authenticationService: new AuthenticationService(), paymentsService: new PaymentsService() });
    next();
}
