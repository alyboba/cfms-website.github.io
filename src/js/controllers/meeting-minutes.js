import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';

export default class MeetingMinutesController extends FirebaseConnection{
	constructor(authenticationService, ModalController) {
		super();
		this.utils = new Utils();
		this.ModalController = ModalController;
		this.refPath = 'meeting-minutes/';
		//meetingMinutesController;
		this.auth = authenticationService;
		this.process();
	}
	process() {
		//meetingMinutesController = this;
		if(this.auth.user){ //check if user is signed in
			var firebase = this.firebase;
			console.log("Is this user an admin?  " + this.auth.user.isAdmin);
			var elem, modalElem, temp;
			console.log("We are on page with a user signed in!");
			var subRefPath = '';
			var subSubRefPath = '';
			//var refPath = 'meeting-minutes/';
			if(this.utils.isPageEnglish()){
				this.refPath = this.refPath+'en';
			}
			else{
				this.refPath = this.refPath+'fr';
			}
			this.firebase.database().ref(this.refPath).on('value', (snapshot) => {
				//console.log("First iteration snap shot = " + snapshot);
				//subRefPath = refPath;
				snapshot.forEach((childSnapshot) => {
					//console.log("second iteration snap shot = " + childSnapshot);
					elem = '';
					subRefPath = this.refPath;
					subRefPath += '/'+childSnapshot.key;
					//elem += '<blockquote>'; 
					elem += '<h3 class="bold-red meetingMinuteYear">'+childSnapshot.key+'</h3>';
					childSnapshot.forEach((subChildSnapshot) => {
						//console.log("Third iteration snap shot = " + subChildSnapshot);
						subSubRefPath = subRefPath+'/'+subChildSnapshot.key;
						elem += '<p><strong class="meetingMinuteTitle">'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<p class="meetingMinuteSubTitle">'+subChildSnapshot.val().subTitle+'</p>';
						elem += '<a href="'+subChildSnapshot.val().fileLink+'" target="_blank">'+ subChildSnapshot.val().fileTitle +'</a><br>'
						if(true) { //TODO: Add check this.auth.user.isAdmin
							//add admin if here
							
							//modalElem = this.utils.populateModalData(subChildSnapshot.val().title, subChildSnapshot.val().subTitle, subSubRefPath);
							//elem += modalElem;
							//let updateButton = this.utils.createButton(subSubRefPath, "Update", "updateEntry");
							//elem += updateButton;
							let deleteButton = this.utils.createButton(subSubRefPath, "Delete", "deleteEntry");
							elem += deleteButton;
						} //end admin if here
						elem += '<br><br>';
					});
					//if(true){ //This will be if the user is an admin!
					//	
					//}
					//elem += '</blockquote>';
					temp = document.createElement("blockquote");
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').appendChild(temp);
				});
				if(true) {
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.refPath, "Add", "addEntry");
					elem = addButton;
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').appendChild(temp);
				}
				//console.log(this.ModalController);
				//TODO: may be fucked somewhere in here as well.. >.>
				if(true) { //TODO: Add check this.auth.user.isAdmin
					this.modalController = new this.ModalController();
					 //end admin if here
					//var updateButtons = document.getElementsByClassName("updateEntry");
					//for(let i=0; i< updateButtons.length; i++){
					//	updateButtons[i].addEventListener('click', this.updateMeetingMinutesEvent.bind(this), false);
					//	
					//}
					var deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						deleteButtons[i].addEventListener('click', this.deleteMeetingMinutesEvent.bind(this), false);
					}
					var addButtons = document.getElementsByClassName("addEntry");
					for(let i=0; i<addButtons.length; i++){
						addButtons[i].addEventListener('click', this.addMeetingMinutesEvent.bind(this), false);
					}
					var fileUploads = document.getElementsByClassName('uploadFile');
					for(let i=0; i<fileUploads.length; i++){
						fileUploads[i].addEventListener('change', this.fileUploadEvent.bind(this), false);
					}
					
				}
			});
		}
		
		
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
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
				var fileUpload = document.getElementById('uploadFile');
				if (!data) {
					console.log('Cancelled');
				} else {
					console.log("hitting the add shit here?");
					if (modalController.isProperYearRange(data.year, 2000, 2030)) {
						console.log("got into the if statement b4 the function?!?!");
						modalController.addMeetingMinutes(data.year, data.title, data.subTitle, fileUpload.files[0], true, null);
						//modalController.storeFile(fileUpload.files[0]);
						//console.log(fileInput.files[0].name);
					}
					else{
						vex.dialog.alert("Year must be between 2000 and 2030");
					}
				}
			}
		});
	}
	
	
	deleteMeetingMinutesEvent(evt){
		var dbPath = evt.target.value;
		//console.log(dbPath);
		//console.log(evt.target.value);
		this.deleteMeetingMinutes(dbPath);
	}
	//TODO: need to fix this.. sigh....
	//updateMeetingMinutesEvent(evt){
	//	var utils = new Utils();
	//	var modalController = this;
	//	var dbPath = evt.target.value;
	//	var title = evt.target.previousElementSibling.previousElementSibling.firstElementChild.innerHTML;
	//	var subTitle = evt.target.previousElementSibling.innerHTML;
	//	var year = evt.target.parentNode.getElementsByClassName('meetingMinuteYear')[0].innerHTML;
	//	console.log(year);
	//	vex.dialog.open({
	//		message: 'Update Values',
	//		input: [
	//			'<input name="year" type="text" value="'+year+'" required/>',
	//			'<input name="title" type="text" placeholder="'+title+'" required />',
	//			'<input name="subTitle" type="text" placeholder="'+subTitle+'" required />'
	//		].join(''),
	//		buttons: [
	//			$.extend({}, vex.dialog.buttons.YES, { text: 'Update' }),
	//			$.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
	//		],
	//		callback: function (data) {
	//			if (!data) { //This executes if user clicks back.
	//				console.log('Cancelled')
	//			} else { //This executes if user clicks update.
	//				//Add check that year is a year
	//				if(data.year === year){
	//					console.log("Executing when year == year!")
	//					modalController.updateMeetingMinutes(dbPath, data.title, data.subTitle);
	//					//Just update the other stuff....
	//				}
	//				else{
	//					console.log("year does not = year.");
	//					//Check if year entered is proper year
	//					//Delete old entry @ year,
	//					//add new entry into database....
	//					if (modalController.isProperYearRange(data.year, 2000, 2030)) {
	//						var oldEntryPath = dbPath;
	//						console.log("year is in correct format...");
	//						modalController.addMeetingMinutes(data.year, data.title, data.subTitle, false, oldEntryPath);
	//					} //end if
	//					else {
	//						vex.dialog.alert("Year must be between 2000 and 2030");
	//					}
	//				}
	//			} //end else
	//		} // end vex.open callback
	//	});
	//	
	//}
	deleteMeetingMinutes(dbPath){
		//let modalController = this;
		this.vexConfirm().then( () =>{
			firebase.database().ref(dbPath).once('value').then( (snapshot) => {
				var filePath = snapshot.val().filePath;
				var storageRef = firebase.storage().ref(filePath);
				storageRef.delete().then( () =>{
					firebase.database().ref(dbPath).remove().then(() =>{
						document.getElementById('meetingMinutes').innerHTML = "";
						//modalController.process();
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
						location.reload();
					});
				});
			});
			//console.log(dataRef.val().filePath);

		});
		
	}
	
	//updateMeetingMinutes(dbPath, title, subTitle){
	//	//let modalController = this;
	//	this.vexConfirm().then( () =>{
	//		firebase.database().ref(dbPath).update({
	//			title: title,
	//			subTitle: subTitle,
	//		}).then(() => {
	//			document.getElementById('meetingMinutes').innerHTML = "";
	//			//modalController.process();
	//			vex.dialog.alert('<h3><strong>Success!</strong></h3>');
	//			location.reload();
	//		});
	//	});		
	//}
	
	addMeetingMinutes(year, title, subTitle, file, justAdd, oldEntryPath){
		let modalController = this;
		//let modalController = this;
		this.vexConfirm().then( () => {
			modalController.fileUploadPromise(file).then( (fileObject ) =>{
				console.log(fileObject.downloadURL);
				console.log(fileObject.filePath);
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
					document.getElementById('meetingMinutes').innerHTML = "";
					//modalController.process();
					vex.dialog.alert('<h3><strong>Successfully added new Entry!</strong></h3>');
					//location.reload(); TODO: add this back to prevent db errors!
				});
				
			}).catch((error) => {
				console.log("an Error occured, error number "+ error);
			})
		}).catch( () => {
			console.log("The promise returned false!!!!");
		});
		console.log(this.refPath);
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
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running');
						break;
				}
			}, (error) => {
				reject(error)
				//console.log('upload was unsucessful!!');
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
						resolve(true);
					}
					else {
						reject(false);
					}
				} //end vex confirm callback
			});
		});
		
		
	}
}



