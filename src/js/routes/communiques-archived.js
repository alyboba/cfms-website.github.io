import CommuniquesController from '../controllers/communiques';
import AuthenticationService from '../services/authentication';
import FirebaseStorageRepository from "../repositories/firebase/firebase-storage";

export default function ArchivedCommuniques(ctx, next) {
	new CommuniquesController('communiques/archived/', new AuthenticationService(), new FirebaseStorageRepository('communiques/archived/'));
	next();
}