import Utils from '../utils';
import { FirebaseConnection } from '../repositories/firebase/utils';
import { FirebaseStorageRepository } from "../repositories/firebase/firebase-storage";

export default class CommuniquesController extends FirebaseConnection {
	constructor(path, authenticationService, firebaseStorageService ) {
		super();
		this.firebaseStorage = firebaseStorageService;
		this.utils = new Utils();
		this.refPath = path;
		this.storageRefPath = 'communiques/';
		this.auth = authenticationService;
		this.process();
	}
	
	process(){
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
						elem += '<a href="'+subChildSnapshot.val().fileLink+'" target="_blank">'+ subChildSnapshot.val().title +'</a><br>'
						if(this.auth.user.isAdmin) { //TODO: Add check this.auth.user.isAdmin
							let deleteButton = this.utils.createButton(subSubRefPath, "Delete", "deleteEntry");
							elem += deleteButton;
						} //end admin if
						elem += '<br>';
					}); //end third DB call
					
					
					
					temp = document.createElement("blockquote");
					temp.innerHTML = elem;
					document.getElementById('communiqueInformation').insertBefore(temp, document.getElementById('communiqueInformation').firstChild);
				}); //end second Db call
				
				if(this.auth.user.isAdmin) {  //Executes if user is an admin user.
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.refPath, "Add", "addEntry");
					elem = addButton;
					temp.innerHTML = elem;
					document.getElementById('communiqueInformation').insertBefore(temp, document.getElementById('communiqueInformation').firstChild);
					
					//These will get updated every time a change is made to Database.
					let deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						deleteButtons[i].addEventListener('click', this.deleteMeetingMinutesEvent.bind(this), false);
					}
					let addButtons = document.getElementsByClassName("addEntry");
					for(let i=0; i<addButtons.length; i++){
						addButtons[i].addEventListener('click', this.addCommuniqueEvent.bind(this), false);
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
	
	
	addCommuniqueEvent(evt){
		evt.preventDefault();
		let htmlInput = '<input name="year" type="text" placeholder="Year" required/>'+
			'<input name="title" type="text" placeholder="Title" required />'+
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
	} // end addCommuniqueEvent
	
	
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