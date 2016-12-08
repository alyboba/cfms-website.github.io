
export default class PaymentConfirmation {
    constructor(user, urlParameters) {
        this.user = user;
        this.username = urlParameters.get('ref1');
        this.approved = Boolean(parseInt(urlParameters.get('trnApproved')));
        if (this.approved) window.app.vex.dialog.alert('Hello, World!');
        this.updateForm();
    }

    updateForm() {
        let div = document.getElementById('description');
        div.innerHTML = `The user is: ${this.username}`;
        return 'Payment confirmed for: ' + this.username;
    }
}