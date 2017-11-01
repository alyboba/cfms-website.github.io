import Utils from '../utils';
import { FirebaseConnection } from '../repositories/firebase/utils';

export default class CommuniquesController extends FirebaseConnection {
	constructor({ authenticationService }) {
		super();
		this.utils = new Utils();
		this.refPath = 'communiques/';
		this.containerId = 'communiqueInformation';
		this.service = authenticationService;
		this.process();
	}
	
	process(){
		if(this.auth.user){ //check if user signed in
			
			
			
			
			
		} //end if auth user
		else{
			console.log("not signed in");
		}
	} // end process()
}