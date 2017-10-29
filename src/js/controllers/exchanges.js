import request from 'request-promise';
import Utils from '../utils';

export default class ExchangesController {
    constructor({ authenticationService, paymentsService }) {
        this.service = paymentsService;
        this.auth = authenticationService;
        this.utils = new Utils();
        document.addEventListener('beanstream_payform_complete', this.processPayform.bind(this), false);
        this.checkExchangePayment();
    }

    get eventId() {
        return document.getElementById("payment-form").getAttribute("payment-id");
    }

    processPayform(e) {
            if (!this.auth.user) return console.log("You must be logged in to proceed.");
            let data = e.eventDetail;
            data.id = this.eventId;
            var options = {
                method: 'POST',
                uri: `https://cfms.us.webtask.io/api/payments/`, // TODO: devapi when in debug mode
                headers: {
                    'Authorization': `Bearer ${this.auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: data,
                json: true // Automatically parses the JSON string in the response
            };

            request(options)
                .then((data) => {
                    if (data.message === "Declined") return this.utils.showAlert("Declined", "Please check your payment information.");
                    this.utils.showAlert("Success", "We look forward to seeing you at the event!");
                    this.handleUserAlreadyPaid();
                })
                .catch(function (err) {
                    this.utils.showAlert("Something went wrong", "Please try again later.");
                });
    }

    checkExchangePayment() {
        if (!this.auth.user) return;
        this.service.checkExchangePayment(this.auth.user.uid, this.eventId, (paid) => {
            if (paid) this.handleUserAlreadyPaid();
        });
    }

    handleUserAlreadyPaid() {
        document.getElementById("payment-container").innerHTML = "<h4><strong>You have already paid for your exchange!</strong></h4>";
    }
}