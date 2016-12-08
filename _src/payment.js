export default class Payment {
    constructor(user, beanstreamURL) {
        this.user = user;
        this.url = beanstreamURL;
        this.initPaymentForm();
    }

    initPaymentForm() {
        let ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', 'payment-form'); // assign an id 
        let el = document.getElementById('new-account-right');
        el.parentNode.insertBefore(ifrm, el); // assign
        ifrm.setAttribute('src', this.url + '&approvedPage=http://127.0.0.1:4000/members/payments/confirmation.html&ref1=' + this.user.uid);
    }
}