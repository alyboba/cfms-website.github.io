import Firebase from 'firebase';
import * as Config from '../config';


const firebase = Firebase.initializeApp(Config.firebase);

class FirebaseConnection {
    constructor() {
        this.firebase = firebase;
    }
}

class FirebaseRef extends FirebaseConnection {
  constructor(context) {
    super();
    this.context = context;
  }

  get ref() {
    // TODO: check if user is logged in
    return firebase.database().ref(this.context);
  }
}

export { FirebaseRef, FirebaseConnection };