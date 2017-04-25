import { FirebaseRef } from './utils';

export default class Repository {
    constructor(Model, refName) {
        this.Model = Model;
        this.ref = new FirebaseRef(refName).ref;
    }

    get(id) {
        return this.ref.child(id).once('value').then(snapshot => new this.Model(snapshot.val()));
    }

    getAll() {
        return this.ref.orderByKey().once('value');
    }
}