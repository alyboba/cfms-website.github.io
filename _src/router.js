import PaymentConfirmation from './payment-confirmation';

export default class Router {
    constructor() {
        this.user;
        this.skipInit = false;
        this.process();
    }

    process() {
        if (this.user) {
            if (new RegExp('\/members\/payments\/.+').test(window.location.pathname)) {
                var event = new CustomEvent('userUpdated', { detail: this.user });
                return document.dispatchEvent(event);
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

    handlePaymentConfirmation() {
        this.skipInit = true;
        let urlParams = new URLSearchParams(window.location.search);
        new PaymentConfirmation(urlParams).process();
    }

    shouldSkipInit() {
        return this.skipInit;
    }

    setUser(user) {
        this.user = user;
        this.process();
    }
}