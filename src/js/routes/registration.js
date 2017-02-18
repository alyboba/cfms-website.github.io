/**
 * Handles the sign up button press.
 */
export default function Registration(ctx, next) {
    document.getElementById('signup-button').addEventListener('click', _register.bind(this), false);
    next();
}

function _register() {
    var email = document.getElementById('account-email').value;
    var password = document.getElementById('account-password-first').value;
    var passwordAgain = document.getElementById('account-password-second').value;
    var authenticationCode = document.getElementById('account-authentication-code').value;
    if (password !== passwordAgain) {
        this.vex.dialog.alert({unsafeMessage: '<h3><strong>Passwords do not Match</strong></h3><p>Please try again.</p>'});
        return;
    }
    if (email.length < 4) {
        this.vex.dialog.alert({unsafeMessage: '<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>'});
        return;
    }
    if (password.length < 7) {
        this.vex.dialog.alert({unsafeMessage: '<h3><strong>Weak Password</strong></h3><p>Please ensure that your password is at least 7 characters.</p>'})
        return;
    }

    this.auth0.webAuth.signup({
        connection: "cfms-firebase",
        email: email,
        password: password,
        user_metadata: {
            auth_code: authenticationCode
        }
    }, (err) => {
        console.log(err);
        if (err) return this.vex.dialog.alert({
            unsafeMessage: '<h3><strong>Something went wrong</strong></h3><p>' +
            ((err.description) ? err.description : "Please check your authentication code.") + '</p>'
        });
        this.auth0.authentication.login({
            realm: "cfms-firebase",
            username: email,
            password: password
        }, (err, res) => {
            if (err) return console.log(err);
            console.log(res);
            this.handleAuthenticatedUser(res);
        })
        this.vex.dialog.alert({ unsafeMessage: '<h3><strong>Account Successfully Created</strong></h3><p>Your account has successfully been created! You are now logged in. Welcome to the CFMS!</p>' });
    });
}