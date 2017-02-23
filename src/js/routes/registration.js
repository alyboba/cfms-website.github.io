import Utils from '../utils';

/**
 * Handles the sign up button press.
 */
export default function Registration(ctx, next) {
    document.getElementById('signup-button').addEventListener('click', _register.bind(this), false);
    next();
}

function _register() {
    let utils = new Utils();
    var email = document.getElementById('account-email').value;
    var password = document.getElementById('account-password-first').value;
    var passwordAgain = document.getElementById('account-password-second').value;
    var authenticationCode = document.getElementById('account-authentication-code').value;
    if (password !== passwordAgain) return utils.showAlert("Passwords do not match", "Please try again.");
    if (email.length < 4) return utils.showAlert("Enter an Email Address", "Please enter an email address.");
    if (password.length < 7) return utils.showAlert("Weak Password", "Please ensure that your password is at least 7 characters.");

    this.auth0.webAuth.signup({
        connection: "cfms-firebase",
        email: email,
        password: password,
        user_metadata: {
            auth_code: authenticationCode,
            firstName: document.getElementById('account-first-name').value,
            lastName: document.getElementById('account-last-name').value,
            medicalSchool: document.getElementById('account-medical-school').value,
            graduationYear: document.getElementById('account-graduation-year').value
        }
    }, (err) => {
        let desc = err.description || "Please check your authentication code.";
        utils.showAlert("Something went wrong", desc);
        this.auth0.authentication.login({
            realm: "cfms-firebase",
            username: email,
            password: password
        }, (err, res) => {
            if (err) return console.log(err);
            console.log(res);
            this.handleAuthenticatedUser(res);
        })
        utils.showAlert("Account Successfully Created", "Your account has successfully been created! Click OK to be logged in and redirected to the members area. Welcome to the CFMS!");
    });
}