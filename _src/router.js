import Payment from './payment';
import PaymentConfirmation from './payment-confirmation';

export default class Router {
    constructor() {
        this.user;
        this.payment;
        this.skipInit = false;
        this.beanstreamURL;
        this.update();
    }

    update() {
        if (this.user) {
            if (new RegExp('\/members\/payments\/.+').test(window.location.pathname) && this.beanstreamURL) {
                return this.handlePaymentInit();
            }
        }

        switch (window.location.pathname) {
            case '/members/payments/confirmation.html':
                this.handlePaymentConfirmation();
                break;
            default:
                console.log('Other');
        }
    }

    handlePaymentInit() {
        if (!this.payment) this.payment = new Payment(this.user, this.beanstreamURL);
    }

    setBeanstreamURL(url) {
        this.beanstreamURL = url;
        this.update();
    }

    handlePaymentConfirmation() {
        this.skipInit = true;
        let urlParams = new URLSearchParams(window.location.search);
        new PaymentConfirmation(this.user, urlParams);
    }

    shouldSkipInit() {
        return this.skipInit;
    }

    setUser(user) {
        this.user = user;
        this.update();
    }
}