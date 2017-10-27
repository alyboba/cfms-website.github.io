import { FirebaseConnection } from '../repositories/firebase/utils';

export default class LoginController extends FirebaseConnection{
	constructor() {
		super();
		this.process();
	}
	
	process(){
		window.submitApplication = function (e){
			console.log("Submit Applicatoin was pressed!! and my context is ");
			console.log(e)
			insideFunction(e);
		}
		
		function insideFunction(e) {
			console.log("I am an inside application calling ");
			console.log(e);
		}
			
		
		
		
	}
	
	
}