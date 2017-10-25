/**
 * Created by Justin on 10/24/2017.
 */
import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';



export default class RepResourcesController extends FirebaseConnection {
	constructor(authenticationService){
		super();
		this.auth = authenticationService;
		this.process();
	}
	
	process(){
		console.log("Hi from repResourcesController!!");
		if(this.auth.user){
			console.log("This user is signed in, lets do some stuff!");
		}
		else{
			console.log("user is not signed in, don't show anything!");
		}
	}
}