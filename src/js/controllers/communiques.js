import Utils from '../utils';
import { FirebaseConnection } from '../repositories/firebase/utils';

export default class CommuniquesController extends FirebaseConnection {
	constructor({ authenticationService }) {
		super();
		this.utils = new Utils();
		this.service = authenticationService;
		this.process();
	}
	
	process(){
		console.log("HI from communiques controller!");
	}
}