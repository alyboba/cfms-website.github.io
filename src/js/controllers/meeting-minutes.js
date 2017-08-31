import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';

export default class MeetingMinutesController extends FirebaseConnection{
	constructor(authenticationService, ModalController) {
		super();
		this.utils = new Utils();
		this.refPath = 'meeting-minutes/';
		this.auth = authenticationService;
		this.process();
	}
	process() {
		if(this.auth.user){ //check if user is signed in
			console.log("Is this user an admin?  " + this.auth.user.isAdmin);
			let elem, temp; //Variables used to populate page with html.
			let subRefPath = ''; //Variables used to assign paths to the delete buttons.
			let subSubRefPath = '';
			if(this.utils.isPageEnglish()){ //Sets database path to english or french version!
				this.refPath = this.refPath+'en';
			}
			else{
				this.refPath = this.refPath+'fr';
			}
			this.firebase.database().ref(this.refPath).on('value', (snapshot) => { //Iterating over the database
				snapshot.forEach((childSnapshot) => { //This iterates over the years in the database.
					//console.log("second iteration snap shot = " + childSnapshot);
					elem = ''; //Resetting variable for next iteration.
					subRefPath = this.refPath +'/'+childSnapshot.key;
					elem += '<h3 class="bold-red meetingMinuteYear">'+childSnapshot.key+'</h3>';
					childSnapshot.forEach((subChildSnapshot) => { //This iterates over all nodes within each year currently on in DB.
						subSubRefPath = subRefPath+'/'+subChildSnapshot.key;
						elem += '<p><strong class="meetingMinuteTitle">'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<p class="meetingMinuteSubTitle">'+subChildSnapshot.val().subTitle+'</p>';
						elem += '<a href="'+subChildSnapshot.val().fileLink+'" target="_blank">'+ subChildSnapshot.val().fileTitle +'</a><br>'
						if(this.auth.user.isAdmin) { //TODO: Add check this.auth.user.isAdmin
							let deleteButton = this.utils.createButton(subSubRefPath, "Delete", "deleteEntry");
							elem += deleteButton;
						} //end admin if
						elem += '<br><br>';
					}); //end third DB call

					temp = document.createElement("blockquote");
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').appendChild(temp);
				}); //end second Db call
				
				if(this.auth.user.isAdmin) {  //Executes if user is an admin user.
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.refPath, "Add", "addEntry");
					elem = addButton;
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').appendChild(temp);
					
					//These will get updated every time a change is made to Database.
					var deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						deleteButtons[i].addEventListener('click', this.deleteMeetingMinutesEvent.bind(this), false);
					}
					var addButtons = document.getElementsByClassName("addEntry");
					for(let i=0; i<addButtons.length; i++){
						addButtons[i].addEventListener('click', this.addMeetingMinutesEvent.bind(this), false);
					}
					
				} //end admin if
			}); //end first database call
		}
		else{
			//TODO: add message if user accidently loads page without being signed in?
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		} //end else 
	}
	
	addMeetingMinutesEvent(evt){
		var modalController = this;
		vex.dialog.open({
			message: 'Add Meeting Minutes',
			input: [
				'<input name="year" type="text" placeholder="Year" required/>',
				'<input name="title" type="text" placeholder="Title" required />',
				'<input name="subTitle" type="text" placeholder="sub Title" required />',
				'<input name="dataFile" id="uploadFile" type="file" required />'
			].join(''),
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, { text: 'Add' }),
				$.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
			],
			callback: function (data) {
				if (!data) {
					console.log('Cancelled');
				} else {
					console.log("hitting the add shit here?");
					if (modalController.isProperYearRange(data.year, 2000, 2030)) {
						var fileUpload = document.getElementById('uploadFile').files[0];
						console.log("got into the if statement b4 the function?!?!");
						modalController.addMeetingMinutes(data.year, data.title, data.subTitle, fileUpload, true, null);
					}
					else{
						vex.dialog.alert("Year must be between 2000 and 2030");
					}
				}
			}
		});
	}
	
	addMeetingMinutes(year, title, subTitle, file, justAdd, oldEntryPath){
		let modalController = this;
		this.vexConfirm().then( () => {
			modalController.fileUploadPromise(file).then( (fileObject ) =>{
				firebase.database().ref(this.refPath+'/'+year).push({
					title: title,
					subTitle: subTitle,
					fileTitle: file.name,
					fileLink: fileObject.downloadURL,
					filePath: fileObject.filePath
				}).then( () => {
					if(!justAdd){
						firebase.database().ref(oldEntryPath).remove().then( () => {
							vex.dialog.alert('<h3><strong>Old Entry Successfully Removed!</strong></h3>');
						});
					}
					vex.dialog.alert('<h3><strong>Successfully added new Entry!</strong></h3>');
					location.reload();
				});
			}).catch((error) => {
				//TODO: add error message in vex, based off error code.
				console.log("an Error occured, error number "+ error);
			})
		}).catch( () => {
			console.log("The promise returned false!!!!");
		});
	}
	
	deleteMeetingMinutesEvent(evt){
		var dbPath = evt.target.value;
		this.deleteMeetingMinutes(dbPath);
	}
	
	deleteMeetingMinutes(dbPath){
		this.vexConfirm().then( () =>{
			firebase.database().ref(dbPath).once('value').then( (snapshot) => {
				var filePath = snapshot.val().filePath;
				var storageRef = firebase.storage().ref(filePath);
				storageRef.delete().then( () =>{
					firebase.database().ref(dbPath).remove().then(() =>{
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
						location.reload();
					});
				});
			});
		});
	}
	
	isProperYearRange(year, startYear, endYear){
		return year > startYear && year < endYear;
	}
	
	fileUploadPromise(file){
		return new Promise((resolve, reject) => {
			var filePath = 'minutes/'+file.name;
			var storageRef = firebase.storage().ref(filePath);
			var uploadTask =	storageRef.put(file);
			uploadTask.on('state_changed', (snapshot) => {
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
			}, (error) => {
				//This function happens if upload hits error.
				reject(error)
				//console.log('upload was unsuccessful!!');
			}, () => {
				//this is for on complete uploads!
				console.log("are we ever hitting the final function!?>!?!?!");
				var downloadURL = uploadTask.snapshot.downloadURL;
				var fileObject = {
					downloadURL: downloadURL,
					filePath: filePath
				};
				resolve(fileObject);
			});
		});
	}
	
	vexConfirm(){
		return new Promise((resolve, reject) => {
			vex.dialog.confirm({
				message: "Are you sure?",
				callback: (value) => {
					if (value) {
						resolve(true); //if user selects yes, promise resolves true
					}
					else {
						reject(false);
					}
				} //end vex confirm callback
			});
		});
		
		
	}
}



