import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import * as Config from './config';
import request from 'superagent';

let utils = null;

export default class Utils {
    constructor() {
        if (utils) return utils;
        utils = this;
        Vex.registerPlugin(VexDialog);
        Vex.defaultOptions.className = Config.vex;
        this.vex = Vex;
    }

    showAlert(title, description) {
        this.vex.dialog.alert({
            unsafeMessage: `<h3><strong>${title}</strong></h3><p>${description}</p>`
        });
    }

    showSigninModal(cb) {
        vex.dialog.open({
            message: '<h3><strong>Log in to cfms.org</strong></h3>',
            input: "<div class='vex-custom-field-wrapper'><label for='email'>EMAIL ADDRESS</label><div class='vex-custom-input-wrapper'><input name='email' id='login-email' type='email' placeholder='Enter your email' /></div></div><div class='vex-custom-field-wrapper'><label for='password'>PASSWORD</label><div class='vex-custom-input-wrapper'><input id='login-password' name='password' type='password' value=''/></div><div id='new-account-link'><a href='/new-account.html'>Create a New Account</a></div><div id='forgot-password'><a href='/forgot-password.html'>Forgot your Password?</a></div></div>",
            callback: function (data) {
                if (data && data.email && data.password) {
                    cb(data.email, data.password);
                }
            }
        });
    }

    getProfile(token, callback) {
        request.get(`https://cfms.auth0.com/tokeninfo?id_token=${token}`)
            .end(function (err, res) {
                if (err) {
                    return callback({
                        error: err.message,
                        error_description: res.text || res.body
                    });
                }

                return callback(null, res.body);
            });
    }
}