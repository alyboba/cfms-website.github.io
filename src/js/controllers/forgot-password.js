export default class AuthenticationController {
    constructor({ authenticationService }) {
        this.service = authenticationService;
        this.bindListeners();
    }

    bindListeners() {
        document.getElementById('change-password-request-button').addEventListener('click', this.sendPasswordReset.bind(this), false);
    }

    sendPasswordReset(evt) {
        evt.preventDefault();
        this.service.resetPassword.bind(this.service)(document.getElementById('reset-email-address').value);
        document.getElementById('reset-email-address').value = '';
    }
}
