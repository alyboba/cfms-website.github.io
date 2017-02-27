import Utils from '../utils';

export default class AuthenticationController {
    constructor({ authenticationService }) {
        this.utils = new Utils();
        this.service = authenticationService;
        this.bindListeners();
    }

    bindListeners() {
        document.getElementById('login-button').addEventListener('click', this.toggleSignIn.bind(this), false);
    }

    toggleSignIn(evt) {
        evt.preventDefault();
        if (!this.service.user) return this.utils.showSigninModal(this.service.login.bind(this.service));
        this.service.logout.call(this.service);
    }
}