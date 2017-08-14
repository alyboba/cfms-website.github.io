import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import * as Config from './config';

let instance = null;

export default class Utils {
    constructor() {
        if (instance) return instance;
        Vex.registerPlugin(VexDialog);
        Vex.defaultOptions.className = Config.vex;
        this.vex = Vex;
        instance = this;
    }

    showAlert(title, description) {
        const titleTemplate = `<h3><strong>${title}</strong></h3>`;
        const descriptionTemplate = `<p>${description}</p>`;
        const message = (description) ? titleTemplate + descriptionTemplate : titleTemplate;
        this.vex.dialog.alert({
            unsafeMessage: message
        });
    }

    showSigninModal(cb) {
        const self = this;
        this.vex.dialog.open({
            unsafeMessage: '<h3><strong>Log in to cfms.org</strong></h3>',
            input: "<div class='vex-custom-field-wrapper'><label for='email'>EMAIL ADDRESS</label><div class='vex-custom-input-wrapper'><input name='email' id='login-email' type='email' placeholder='Enter your email' /></div></div><div class='vex-custom-field-wrapper'><label for='password'>PASSWORD</label><div class='vex-custom-input-wrapper'><input id='login-password' name='password' type='password' value='' placeholder='Enter your password'/></div><div id='new-account-link'><a href='/new-account.html'>Create a New Account</a></div><div id='forgot-password'><a href='/forgot-password.html'>Forgot your Password?</a></div></div>",
            beforeClose: function() {
                if (!this.value) return true;
                else if (!this.value.email || !this.value.password) {
                    let form = $(this.form);
                    let emailField = form.find("input[name='email']");
                    let passwordField = form.find("input[name='password']");
                    if (!this.value.email) emailField.addClass("error-field");
                    if (!this.value.password) passwordField.addClass("error-field");
                    return false;
                }
                $("body").append("<div id='loading-overlay' class='loading'>Loading&#8230;</div>");
                cb(this.value.email, this.value.password, profile => {
                    $("#loading-overlay").remove();
                    self.showAlert("Signed in", `Welcome back ${profile.given_name} ${profile.family_name}.`);
                });
                return true;
            }
        });
    }
    
}