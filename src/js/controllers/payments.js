import request from 'request-promise';
import Utils from '../utils';

export default class PaymentsController {
    constructor({ authenticationService, paymentsService }) {
        this.service = paymentsService;
        this.auth = authenticationService;
        this.utils = new Utils();
        this.eventId = document.getElementById("payment-form").getAttribute("payment-id");
        document.addEventListener('beanstream_payform_complete', this.processPayform.bind(this), false);
        this.checkRegistration();
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
                    this.handleRegisteredUser();
                })
                .catch(function (err) {
                    this.utils.showAlert("Something went wrong", "Please try again later.");
                });
    }

    checkRegistration() {
        if (!this.auth.user) return;
        this.service.checkRegistration(this.auth.user.uid, this.eventId, (registered) => {
            if (registered) this.handleRegisteredUser();
        });
    }

    handleRegisteredUser() {
        document.getElementById("registration-container").innerHTML = "<h4><strong>You are already registered for this event!</strong></h4>";
    }
}