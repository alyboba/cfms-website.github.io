import NavigationMiddleware from './navigation';
import AuthenticationMiddleware from './authentication';
import PaymentMiddleware from './payments';

export default class Middleware {
    constructor(page) {
        page('*', NavigationMiddleware);
        page('*', AuthenticationMiddleware);
        page('/meetings/payment-demo.html', PaymentMiddleware);
    }
}