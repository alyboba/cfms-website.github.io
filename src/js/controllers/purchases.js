import request from 'request-promise';
import Utils from '../utils';

export default class PurchasesController {
    constructor({ authenticationService, paymentsService }) {
        this.service = paymentsService;
        this.auth = authenticationService;
        this.utils = new Utils();
        document.addEventListener('beanstream_payform_complete', this.processPayform.bind(this), false);
    }

    get purchaseId() {
        return document.getElementById("payment-form").getAttribute("payment-id");
    }

    processPayform(e) {
            let data = e.eventDetail;
            data.id = this.purchaseId;
            var options = {
                method: 'POST',
                uri: `https://cfms.us.webtask.io/api/payments/`, // TODO: devapi when in debug mode
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data,
                json: true // Automatically parses the JSON string in the response
            };

            request(options)
                .then((data) => {
                    if (data.message === "Declined") return this.utils.showAlert("Declined", "Please check your payment information.");
                    this.utils.showAlert("Success", "Thank you and enjoy your purchase!");
                    this.handleRegisteredUser();
                })
                .catch(function (err) {
                    this.utils.showAlert("Something went wrong", "Please try again later.");
                });
    }
}