import CommuniquesController from '../controllers/communiques';
import AuthenticationService from '../services/authentication';
import FirebaseStorageRepository from "../repositories/firebase/firebase-storage";


//Shows Member Account Information on the Members Page
export default function Communiques(ctx, next) {
	new CommuniquesController('communiques/', new AuthenticationService(), new FirebaseStorageRepository('communiques/'));
	
	next();
}
