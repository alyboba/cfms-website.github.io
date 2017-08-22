import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';

export default class MeetingMinutesController extends FirebaseConnection{
	constructor(authenticationService, ModalController) {
		super();
		this.utils = new Utils();
		this.ModalController = ModalController;
		this.auth = authenticationService;
		this.process();
	}
	process() {
		if(this.auth.user){
			console.log("Is this user an admin?  " + this.auth.user.isAdmin);
			var elem = '';
			var modalElem;
			console.log("We are on page with a user signed in!");
			var refPath = 'meeting-minutes/';
			if(this.utils.isPageEnglish()){
				refPath = refPath+'en';
			}
			else{
				refPath = refPath+'fr';
			}
			this.firebase.database().ref(refPath).once('value').then((snapshot) => {
				snapshot.forEach((childSnapshot) => {
					elem += '<blockquote>'; 
					elem += '<h3 class="bold-red">'+childSnapshot.key+'</h3>';
					childSnapshot.forEach(function(subChildSnapshot){
						elem += '<p><strong>'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<p>'+subChildSnapshot.val().subTitle+'</p>';
						//add admin if here
						modalElem = '';
						modalElem += '<div class="modal hidden">';
						modalElem += '<div class="modal-content">';
						modalElem += '<div class="modal-header">';
						modalElem += '<h2>'+subChildSnapshot.val().title+'</h2>';
						modalElem += '</div><hr>';
						modalElem += '<div class="modal-body">';
						
						modalElem += '</div><hr>';
						modalElem += '<div class="modal-footer">';
						modalElem += '<button class="btn btn-default modalCloseButton">Close</button>';
						modalElem += '<h3><br></h3></div></div></div>';
						modalElem += '<div><button class="clickMe">';
						modalElem += 'Update' +subChildSnapshot.val().title+'</button></div>';
						elem += modalElem;
						
						//end admin if here

						
						elem += '<br><br>';
					});
					//if(true){ //This will be if the user is an admin!
					//	
					//}
					elem += '</blockquote>';
				});
				
				
				
				document.getElementById('meetingMinutes').innerHTML = elem;
				console.log(this.ModalController);
				this.modalController = new this.ModalController();
			});
			

			
		}
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
		

	}

	
}