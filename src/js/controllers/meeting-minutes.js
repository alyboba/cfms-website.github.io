/*
 * @file
 * Provides Controller Functionality for the meeting-minutes.html page.
 * Populates page with information from database if user is authenticated with firebase as a user
 * Determines if user is also an admin. If true, allows the admin functionality to add/delete entrys from meeting-minutes
 * section in database.
 */

import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';


//TODO: Page could have extra security checks/Ui enhancements. Leaving for now because it is for admins.

export default class MeetingMinutesController extends FirebaseConnection{
	/*
	 * @constructor
	 * @param {Utils} this.utils
	   * Object to access methods from the src/js/utils.js class
	 *  
	 * @param {String} this.refPath
	   * holds the root reference path to the firebase database
	 *   
	 * @param {AuthenticationService} this.auth
	   * Object used to make sure the user accessing the page is authenticated
	 * @event this.process
	   * our base event to be triggered when page initializes.
	 */
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
			let elem, temp, //Variables used to populate page with html.
			    subRefPath = '', //Variables used to assign paths to the delete buttons.
			    subSubRefPath = '';
			if(this.utils.isPageEnglish()){ //Sets database path to english or french version!
				this.refPath = this.refPath+'en';
			}
			else{
				this.refPath = this.refPath+'fr';
			}
			this.firebase.database().ref(this.refPath).on('value', (snapshot) => { //Iterating over the database
				snapshot.forEach((childSnapshot) => { //This iterates over the years in the database.
					elem = ''; //Resetting variable for next iteration.
					subRefPath = this.refPath +'/'+childSnapshot.key;
					elem += '<h2 class="bold-red meetingMinuteYear">'+childSnapshot.key+'</h2>';
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
					document.getElementById('meetingMinutes').insertBefore(temp, document.getElementById('meetingMinutes').firstChild);
				}); //end second Db call
				
				if(this.auth.user.isAdmin) {  //Executes if user is an admin user.
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.refPath, "Add", "addEntry");
					elem = addButton;
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').insertBefore(temp, document.getElementById('meetingMinutes').firstChild);
					
					//These will get updated every time a change is made to Database.
					let deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						deleteButtons[i].addEventListener('click', this.deleteMeetingMinutesEvent.bind(this), false);
					}
					let addButtons = document.getElementsByClassName("addEntry");
					for(let i=0; i<addButtons.length; i++){
						addButtons[i].addEventListener('click', this.addMeetingMinutesEvent.bind(this), false);
					}
				} //end admin if
			}); //end first database call
		}
		else{
			vex.dialog.alert('<h3><strong>You must be signed in to view this page!</strong></h3>');
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		} //end else 
	}
	
	
	/*
	Function used to handle when admin clicks the Add button on webpage.
	@evt: 
	 */
	addMeetingMinutesEvent(evt){
		evt.preventDefault();
		let modalController = this;
		vex.dialog.open({
			message: 'Add Meeting Minutes',
			input: [
				'<input name="year" type="text" placeholder="Year" required/>',
				'<input name="title" type="text" placeholder="Title" required />',
				'<input name="subTitle" type="text" placeholder="sub Title" required />',
				'<input name="uploadFile" id="uploadFile" type="file" class="inputfile" />'+
				'<label for="uploadFile"><i style="padding-right:8px" class="fa fa-file-o" aria-hidden="true"></i> <span>Choose a file&hellip;</span></label>'
			].join(''),
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, { text: 'Add' }),
				$.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
			],
			callback: function (data) { //This executes when a button is pressed
				if (!data) { //Executes if back button pressed
					console.log('Cancelled');
				} else { //Executes if Add button pressed
					console.log("hitting the add shit here?");
					if (modalController.isProperYearRange(data.year, 2000, 2030)) {
						let fileUpload = document.getElementById('uploadFile').files;
						if(fileUpload.length == 1 ) {
							console.log("got into the if statement b4 the function?!?!");
							modalController.addMeetingMinutes(data.year, data.title, data.subTitle, fileUpload[0], true, null);
						}
						else{
							vex.dialog.alert("You may only attach one file per Entry!");
						}
					}
					else{
						vex.dialog.alert("Year must be between 2000 and 2030");
					}
				}
			}
		}).on("change", "#uploadFile", (e) =>{ //This is an event handler dynamically attached only when modal is clicked!.
			var label	 = e.target.nextElementSibling, 
				labelVal = label.innerHTML,
			  fileName = '';
			if( this.files && this.files.length > 1 )
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
			else
				fileName = e.target.value.split( '\\' ).pop();
			
			if( fileName )
				label.querySelector( 'span' ).innerHTML = fileName;
			else
				label.innerHTML = labelVal;
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
				vex.dialog.alert('<h3><strong>'+error+'</strong></h3>');
				console.log("an Error occurred, error number "+ error);
			})
		}).catch( () => {
			console.log("The promise returned false!!!!");
		});
	}
	deleteMeetingMinutesEvent(evt){
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		console.log(dbPath);
		this.deleteMeetingMinutes(dbPath);
		
		
	}
	deleteMeetingMinutes(dbPath){
		this.vexConfirm().then( () =>{
			firebase.database().ref(dbPath).once('value').then( (snapshot) => {
				let filePath = snapshot.val().filePath;
				let storageRef = firebase.storage().ref(filePath);
				console.log(storageRef);
				storageRef.delete().then( () =>{
					firebase.database().ref(dbPath).remove().then(() =>{
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
						location.reload();
					});
				}).catch( () => {
					console.log("The storage in file no longer exists!!!.. Deleting the database entry of broken link!");
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
			let filePath = 'minutes/'+file.name;
			let storageRef = firebase.storage().ref(filePath);
			//console.log(storageRef.getDownloadURL());
			storageRef.getDownloadURL().then( () => { //There already is a file with that name in storage, reject the promise...
					reject("A File With the same name has already been uploaded!");
			}).catch(() => { //There is no file with that name in Db, Lets make one!
				let uploadTask =	storageRef.put(file);
				uploadTask.on('state_changed', (snapshot) => {
					let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
				}, (error) => {
					//This function happens if error hits during upload.
					reject(error);
				}, () => {
					//this is for on complete uploads!
					//console.log("are we ever hitting the final function!?>!?!?!");
					let downloadURL = uploadTask.snapshot.downloadURL;
					let fileObject = {
						downloadURL: downloadURL,
						filePath: filePath
					};
					resolve(fileObject);
				});
				
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



