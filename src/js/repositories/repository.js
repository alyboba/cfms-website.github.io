import { FirebaseRef } from './utils';

export default class Repository {
    constructor(Model, refName) {
        this.Model = Model;
        this.ref = new FirebaseRef(refName);
    }

    get(id) {
        return this.ref.child(id).once('value');
    }
}