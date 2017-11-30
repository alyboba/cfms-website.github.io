/*
 * @file
 * Provides Controller Functionality for the meeting-minutes.html page.
 * Populates page with information from database if user is authenticated with firebase as a user
 * Determines if user is also an admin. If true, allows the admin functionality to add/delete entrys from meeting-minutes
 * section in database.
 */
import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import { FirebaseStorageRepository } from "../repositories/firebase/firebase-storage";

export default class MeetingMinutesController extends FirebaseConnection {

	constructor(authenticationService, firebaseStorageService) {
		super();
		this.firebaseStorage = firebaseStorageService;
		this.utils = new Utils();
		this.refPath = 'meeting-minutes/';
		this.storageRefPath = 'minutes/';
		this.auth = authenticationService;
		this.process();
	}
	/*
	* @type {user-only && admin-only}
	* @event
	  * The main process to execute when controller is initialized via constructor.   
	 */
	process() {
		if(this.auth.user){ //check if user is signed in
			console.log("Is this user an admin?  " + this.auth.user.isAdmin);
			let elem, temp, //Variables used to populate page with html.
			    subRefPath = '', //Variables used to assign paths to the delete buttons.
			    subSubRefPath = '';
			if(this.utils.isPageEnglish()){ //Sets database path to english or french version!
				this.refPath = this.refPath+'en/';
			}
			else{
				this.refPath = this.refPath+'fr/';
			}
			this.firebase.database().ref(this.refPath).on('value', (snapshot) => {
				snapshot.forEach((childSnapshot) => { //This iterates over the years in the database.
					elem = ''; //Resetting variable for next iteration.
					subRefPath = this.refPath +childSnapshot.key;
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
						elem += '<br>';
					}); //end third DB call
					
					temp = document.createElement("blockquote");
					temp.innerHTML = elem;
					document.getElementById('meetingMinutes').insertBefore(temp, document.getElementById('meetingMinutes').firstChild);
				}); //end second Db call
				
				if(this.auth.user.isAdmin) {  //Executes if user is an admin user.
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.childRefPath, "Add", "addEntry");
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
			if(this.utils.isPageEnglish()){
				this.utils.displayVexAlert('You must be signed in to view this page!');
			}
			else{
				this.utils.displayVexAlert('Vous devez être connecté pour voir cette page!');
			}
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		} //end else 
	} //end process
	
	/*
	* @type {Admin-only}
	* @param {object} evt
	  * Holds reference to the dom element that fired the event.
	*/
	addMeetingMinutesEvent(evt){
		evt.preventDefault();
		let htmlInput = '<input name="year" type="text" placeholder="Year" required/>'+
								'<input name="title" type="text" placeholder="Title" required />'+
								'<input name="subTitle" type="text" placeholder="Sub Title" required />'+
								'<input name="uploadFile" id="uploadFile" type="file" class="inputfile" />'+
								'<label for="uploadFile"><i style="padding-right:8px" class="fa fa-file-o" aria-hidden="true"></i> <span>Choose a file&hellip;</span></label>';
		let controller = this;
		//let databaseModel = new DatabaseEntryModel();
		controller.utils.adminDisplayVexDialog(htmlInput, "Add Meeting Minutes",data =>{
			//Grabs data entered by the user.
			if(data && controller.isProperYearRange(data.year, 2000, 2030)) {
				let fileUpload = document.getElementById('uploadFile').files;
				if(fileUpload && fileUpload.length == 1) {
					this.firebaseStorage.fileUploadPromise(fileUpload[0], this.storageRefPath)
						.then((fileObject) => {
							controller.firebase.database().ref(this.refPath+'/'+data.year).push({
								title: data.title,
								subTitle: data.subTitle,
								fileTitle: fileObject.fileTitle,
								fileLink: fileObject.downloadURL,
								filePath: fileObject.filePath
						}).then(() => {
								location.reload();
							}).catch((err) => {
								controller.utils.displayVexAlert('<h3><strong>'+err+'</strong></h3>')
							})
					}).catch((error) => {
						controller.utils.displayVexAlert(error);
						});
				}
				else{
					controller.utils.displayVexAlert("You are missing a file");
				}
			}
		});
	} // end addMeetingMinutesEvent
	
		
	/*
	 * @type {Admin-only}
	 * @param {object} evt
	 *   An object to hold reference to the element that triggered the event.
	 */
	deleteMeetingMinutesEvent(evt){
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		console.log(dbPath);
		this.utils.vexConfirm().then( () => {
			this.deleteMeetingMinutes(dbPath);
		});
	}
	
	/*
	 * @type {Admin-only}
	 * @param {String}
	 *   A string to hold reference to the database Path. Path is stored in the elements src attribute.
	 *   The path is passed to this function through the deleteMeetingsEvent function.
	 */
	deleteMeetingMinutes(dbPath){
			this.firebase.database().ref(dbPath).once('value').then( (snapshot) => {
				let fileName = snapshot.val().fileTitle;
				this.firebaseStorage.deleteEntry(fileName)
					.then(() => {
						this.firebase.database().ref(dbPath).remove()
							.then(() => {
								//this.utils.displayVexAlert('<h3><strong>Success!</strong></h3>');
								location.reload();
							});
					}).catch((err) => {
					console.log(err);
					this.firebase.database().ref(dbPath).remove()
						.then(() => {
							//this.utils.displayVexAlert('<h3><strong>Success!</strong></h3>');
							location.reload();
						});
				});
			});
	}
		
	/*
	 * A utility function to validate a proper year is entered in the modal form when Adding entry to database.
	 * @param {String} year
	 *   The year the user entered
	 * @param {String} startYear
	 *   The floor limit of years allowed.
	 * @param {String} endYear
	 *   The ceiling limit of years allowed.
	 */
	isProperYearRange(year, startYear, endYear){
			if(year >= startYear && year <= endYear){
				return true;
			}
			else{
				this.utils.displayVexAlert("Year must be between "+startYear+" and "+ endYear+ " inclusive");
				return false;
			}
	}
}



