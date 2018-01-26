import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';

export default class ElectivesController extends FirebaseConnection {
	constructor(authService) {
		super();
		this.utils = new Utils();
		this.auth = authService;
		this.refPath = 'electives/';
		this.dbRef;
		this.userName = null;
		this.userId = null;
		this.table;
		this.process();
	}
	
	process(){
		console.log("Hello from electives controller!");
	}
	
}