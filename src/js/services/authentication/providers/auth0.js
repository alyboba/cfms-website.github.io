import Auth0 from 'auth0-js';
import Utils from '../../../utils';
import * as Config from '../../../config';

export default class Auth0Provider {
    constructor() {
        this.auth0 = {};
        this.auth0.authentication = new Auth0.Authentication(Config.auth0);
        this.auth0.webAuth = new Auth0.WebAuth(Config.auth0);
        this.utils = new Utils();
    }

    getAccessToken(email, password, cb) {
        this.auth0.authentication.login({
            realm: "cfms-firebase",
            username: email,
            password: password
        }, (err, authResult) => {
            if (err) return cb(err);
            localStorage.setItem('accessToken', authResult.accessToken);
            this.auth0.authentication.userInfo(authResult.accessToken, (err, user) => {
                if (err) return cb(err);
                cb(null, authResult.accessToken, user.sub);
            });
        });
    }

    logout() {
        this.auth0.webAuth.logout((window.config.env === "development") ? Config.dev_logout : Config.logout); // TODO: change the way I get the config
    }

    register(user, cb) {
        user.connection = "cfms-firebase";
        this.auth0.webAuth.signup(user, cb);
    }

    resetPassword(email) {
        this.auth0.webAuth.changePassword({
            email: email,
            connection: "cfms-firebase"
        }, (err, resp) => {
            if(err) return this.utils.showAlert("Error", err.message);
            this.utils.showAlert("Email Sent", resp);
        });
    }
}