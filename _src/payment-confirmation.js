export default class PaymentConfirmation {
    constructor(urlParameters) {
        this.username = urlParameters.get('ref1');
    }

    process() {
        let div = document.getElementById('description');
        div.innerHTML = `The user is: ${this.username}`;
        return 'Payment confirmed for: ' + this.username;
    }
}