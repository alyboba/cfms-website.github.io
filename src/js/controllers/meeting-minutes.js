/*
 * @file
 * Provides Controller Functionality for the meeting-minutes.html page.
 * Populates page with information from database if user is authenticated with firebase as a user
 * Determines if user is also an admin. If true, allows the admin functionality to add/delete entrys from meeting-minutes
 * section in database.
 */

//import { FirebaseRef } from '../repositories/firebase/utils';
import Utils from '../utils';
import { AdminUtils } from "../repositories/firebase/adminUtils";
import DatabaseEntryModel from "../models/meeting-minutes";
//import DatabaseEntryModel from '../models/meeting-minutes';


//TODO: Page could have extra security checks/Ui enhancements. Leaving for now because it is for admins.

export default class MeetingMinutesController extends AdminUtils {
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
	constructor(authenticationService, DatabaseEntryModel) {
		super('meeting-minutes/', DatabaseEntryModel);
		this.utils = new Utils();
		this.dataModel = DatabaseEntryModel;
		//this.Model = DatabaseEntryModel;
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
						elem += '<br>';
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
					controller.fileUploadPromise(controller.storageRefPath, fileUpload[0])
						.then((fileObject) => {
							let key = data.year;
							delete data.year;
							let databaseModel = new controller.dataModel(key, data);
							databaseModel.bundleFileWithData(fileObject);
							controller.addEntry(controller.refPath+databaseModel.key, databaseModel.obj)
								.then(msg =>{
								controller.utils.displayVexAlert(msg);
								}).catch(error => {
								controller.utils.displayVexAlert(error);
							});
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
			
	somefunction(){
		
	}
	
	/*
	 * @type {Admin-only}
	 * @param {object} evt
	 *   An object to hold reference to the element that triggered the event.
	 */
	deleteMeetingMinutesEvent(evt){
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		console.log(dbPath);
		this.deleteMeetingMinutes(dbPath);
	}
	
	/*
	 * @type {Admin-only}
	 * @param {String}
	 *   A string to hold reference to the database Path. Path is stored in the elements src attribute.
	 *   The path is passed to this function through the deleteMeetingsEvent function.
	 */
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
	
	// /*
	//  * A custom made promise to determine that a file properly uploads
	//  * @param {Object} file
	//  *   The file the user uploaded
	//  */
	// fileUploadPromise(file){
	// 	return new Promise((resolve, reject) => {
	// 		let filePath = 'minutes/'+file.name;
	// 		let storageRef = firebase.storage().ref(filePath);
	// 		//console.log(storageRef.getDownloadURL());
	// 		storageRef.getDownloadURL().then( () => { //There already is a file with that name in storage, reject the promise...
	// 				reject("A File With the same name has already been uploaded!");
	// 		}).catch(() => { //There is no file with that name in Db, Lets make one!
	// 			let uploadTask =	storageRef.put(file);
	// 			uploadTask.on('state_changed', (snapshot) => {
	// 				let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	// 				console.log('Upload is ' + progress + '% done');
	// 			}, (error) => {
	// 				//This function happens if error hits during upload.
	// 				reject(error);
	// 			}, () => {
	// 				//this is for on complete uploads!
	// 				//console.log("are we ever hitting the final function!?>!?!?!");
	// 				let downloadURL = uploadTask.snapshot.downloadURL;
	// 				let fileObject = {
	// 					downloadURL: downloadURL,
	// 					filePath: filePath
	// 				};
	// 				resolve(fileObject);
	// 			});
	//			
	// 		});
	// 	});
	// }
	//
	// /*
	//  * A custom promise for if a user is sure to continue or not.
	//  */
	// vexConfirm(){
	// 	return new Promise((resolve, reject) => {
	// 		vex.dialog.confirm({
	// 			message: "Are you sure?",
	// 			callback: (value) => {
	// 				if (value) {
	// 					resolve(true); //if user selects yes, promise resolves true
	// 				}
	// 				else {
	// 					reject(false);
	// 				}
	// 			} //end vex confirm callback
	// 		});
	// 	});
	// }
}



