export default class MembersController {
    constructor(authenticationService) {
        this.auth = authenticationService;
        this.process();
    }

    process() {
        if (this.auth.user) {
            let profile = this.auth.user;
            var firstName = profile.given_name;
            var lastName = profile.family_name;
            document.getElementById('account-name').textContent = firstName + ' ' + lastName;
            document.getElementById('account-school').textContent = profile.user_metadata.medical_school;
            document.getElementById('account-grad-year').textContent = profile.user_metadata.graduation_year;
            var accountEmail = document.getElementById('account-email');
            accountEmail.textContent = profile.email;
            accountEmail.href = 'mailto:' + profile.email;
        }
        else {
            document.getElementById('account-name').textContent = '';
            document.getElementById('account-school').textContent = '';
            document.getElementById('account-grad-year').textContent = ''
            var accountEmail = document.getElementById('account-email');
            accountEmail.textContent = '';
            accountEmail.href = '';
        }
    }
}