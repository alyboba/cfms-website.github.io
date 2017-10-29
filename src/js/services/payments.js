import { FirebaseConnection } from '../repositories/firebase/utils';

export default class PaymentsService extends FirebaseConnection {
    constructor() {
        super();
    }

    checkRegistration(uid, name, cb) {
        this.firebase.database().ref(`/users/${uid}/registrations`).orderByKey().once("value")
            .then((registrations) => {
                let found = registrations.forEach((registration) => {
                    if (name === registration.val()) return true;
                });
                return cb(found);
            });
    }

    checkExchangePayment(uid, name, cb) {
        this.firebase.database().ref(`/users/${uid}/exchanges`).orderByKey().once("value")
            .then(payments => {
                let found = payments.forEach(payment => {
                    if (name === payment.val()) return true;
                });
                return cb(found);
            });
    }
}