/**
 * Created by Justin on 7/8/2017.
 */
import ModalController from '../controllers/showModal';

//Shows Member Account Information on the Members Page
export default function modal(ctx, next) {
	new ModalController();
	
	next();
}