//Shows Member Account Information on the Members Page
export default function members(ctx, next) {
    if (this.user) {
        this.firebase.database().ref('/users/' + this.uid).once('value').then((snapshot) => {
            var firstName = snapshot.val().firstName;
            var lastName = snapshot.val().lastName;
            document.getElementById('account-name').textContent = firstName + ' ' + lastName;
            document.getElementById('account-school').textContent = snapshot.val().medicalSchool;
            document.getElementById('account-grad-year').textContent = snapshot.val().graduationYear;
            var accountEmail = document.getElementById('account-email');
            accountEmail.textContent = this.user.email;
            accountEmail.href = 'mailto:' + this.user.email;
        });
    }
    else {
        document.getElementById('account-name').textContent = '';
        document.getElementById('account-school').textContent = '';
        document.getElementById('account-grad-year').textContent = ''
        var accountEmail = document.getElementById('account-email');
        accountEmail.textContent = '';
        accountEmail.href = '';
    }
    next();
}
