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
			var firebase = this.firebase;
			console.log("Is this user an admin?  " + this.auth.user.isAdmin);
			var elem, modalElem;
			console.log("We are on page with a user signed in!");
			var subRefPath = '';
			var subSubRefPath = '';
			var refPath = 'meeting-minutes/';
			if(this.utils.isPageEnglish()){
				refPath = refPath+'en';
			}
			else{
				refPath = refPath+'fr';
			}
			this.firebase.database().ref(refPath).on('value', (snapshot) => {
				elem = '';
				subRefPath = refPath;
				snapshot.forEach((childSnapshot) => {
					subRefPath += '/'+childSnapshot.key;
					elem += '<blockquote>'; 
					elem += '<h3 class="bold-red">'+childSnapshot.key+'</h3>';
					childSnapshot.forEach((subChildSnapshot) => {
						subSubRefPath = subRefPath+'/'+subChildSnapshot.key;
						elem += '<p><strong>'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<p>'+subChildSnapshot.val().subTitle+'</p>';
						if(true) { //TODO: Add check this.auth.user.isAdmin
							//add admin if here
							modalElem = '';
							modalElem += '<div class="modal hidden">';
							modalElem += '<div class="modal-content">';
							modalElem += '<div class="modal-header">';
							modalElem += '<h2>' + subChildSnapshot.val().title + '</h2>';
							modalElem += '</div><hr>';
							modalElem += '<div class="modal-body">';
							modalElem += '<label>Title:</label>';
							modalElem += '<input class="titleSubmission" type="text" placeholder="'+subChildSnapshot.val().title+'"'+
								'/><br>';
							modalElem += '<label>Sub-Title:</label>';
							modalElem += '<input class="subTitleSubmission" type="text" placeholder="'+subChildSnapshot.val().subTitle+'"'+
								'/><br>';
							modalElem += '</div><hr>';
							modalElem += '<div class="modal-footer">';
							modalElem += '<button value="'+subSubRefPath+'" class="btn btn-default meetingMinutesUpdateButton">Update</button>';
							modalElem += '<button class="btn btn-default modalCloseButton">Close</button>';
							modalElem += '<h3><br></h3></div></div></div>';
							modalElem += '<div><button class="clickMe">';
							modalElem += 'Update</button>';
							modalElem += '<button value="'+subSubRefPath+'" class="deleteEntry">Delete</button></div>';
							
							elem += modalElem;
						} //end admin if here
						elem += '<br><br>';
					});
					//if(true){ //This will be if the user is an admin!
					//	
					//}
					elem += '</blockquote>';
				});
				
				document.getElementById('meetingMinutes').innerHTML = elem;
				//console.log(this.ModalController);
				if(true) { //TODO: Add check this.auth.user.isAdmin
					this.modalController = new this.ModalController();
					 //end admin if here
					var updateButtons = document.getElementsByClassName("meetingMinutesUpdateButton");
					for(let i=0; i< updateButtons.length; i++){
						let updateButton = updateButtons[i];
						updateButton.onclick = this.updateMeetingMinutes;
					}
					var deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						let deleteButton = deleteButtons[i];
						deleteButton.onclick = this.deleteMeetingMinutes;
					}
				}
			});
			
		}
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
		
	}
	deleteMeetingMinutes(){
		var dbPath = this.value;
		console.log(dbPath);
		vex.dialog.confirm({
			message: "Are you sure?",
			callback: (value) =>{
				if(value){
					firebase.database().ref(dbPath).remove().then(() =>{
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
					});
				}
				else{
					console.log("clicked no");
				}
			}
		});
	}
	
	updateMeetingMinutes(){
		var dbPath = this.value;
		var title = this.parentElement.parentElement.getElementsByClassName("titleSubmission")[0].value;
		var subTitle = this.parentElement.parentElement.getElementsByClassName("subTitleSubmission")[0].value;
		vex.dialog.confirm({
			message: "Are you sure?",
			callback: (value) =>{
				if(value){
					firebase.database().ref(dbPath).update({
						title: title,
						subTitle: subTitle,
					}).then(() =>{
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
					});
				}
				else{
					console.log("clicked no");
				}
			}
		});

		console.log("Got in here!");
		console.log(title);
		console.log(subTitle);
		console.log(dbPath);
		//Save the Data into the Db.

	}
	
}







