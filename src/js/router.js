import Payment from './payment';
import PaymentConfirmation from './payment-confirmation';
import Home from './routes/home';
import Members from './routes/members';
import { LeadershipAwardUser, LeadershipAwardAdmin } from './routes/md-leadership-awards';
import Registration from './routes/registration';
import page from 'page';

export default class Router {
    constructor(app) {
        // this.user;
        // this.payment;
        // this.skipInit = false;
        // this.beanstreamURL;
        // this.update();
        page('/', Home.bind(app));
        page('/members', Members.bind(app));
        page('/resources/md-leadership-awards-application.html', LeadershipAwardUser.bind(app));
        page('/resources/md-leadership-awards-view-applications.html', LeadershipAwardAdmin.bind(app));
        page('/new-account.html', Registration.bind(app));
        page.start({ click: false });
    }

    // update() {
    //     if (this.user) {
    //         if (new RegExp('\/members\/payments\/.+').test(window.location.pathname) && this.beanstreamURL) {
    //             return this.handlePaymentInit();
    //         }
    //     }

    //     switch (window.location.pathname) {
    //         case '/members/payments/confirmation.html':
    //             this.handlePaymentConfirmation();
    //             break;
    //         default:
    //             console.log('Other');
    //     }
    // }

    // handlePaymentInit() {
    //     if (!this.payment) this.payment = new Payment(this.user, this.beanstreamURL);
    // }

    // setBeanstreamURL(url) {
    //     this.beanstreamURL = url;
    //     this.update();
    // }

    // handlePaymentConfirmation() {
    //     this.skipInit = true;
    //     let urlParams = new URLSearchParams(window.location.search);
    //     new PaymentConfirmation(this.user, urlParams);
    // }

    // shouldSkipInit() {
    //     return this.skipInit;
    // }

    // setUser(user) {
    //     this.user = user;
    //     this.update();
    // }
}