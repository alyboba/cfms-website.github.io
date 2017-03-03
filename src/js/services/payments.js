import { FirebaseConnection } from '../repositories/utils';

export default class PaymentsService extends FirebaseConnection {
    constructor() {
        super();
    }

    checkRegistration(uid, name, cb) {
        this.firebase.database().ref(`/users/${uid}/registrations`).orderByKey().once("value")
            .then((registrations) => {
                let found = registrations.forEach((registration) => {
                    if (name == registration.val()) return true;
                });
                return cb(found);
            });
    }
}