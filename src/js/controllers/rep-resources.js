/**
 * Created by Justin on 10/24/2017.
 */
import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';
import ModalController from '../controllers/showModal';



export default class RepResourcesController extends FirebaseConnection {
	constructor(authenticationService){
		super();
		this.utils = new Utils();
		this.refPath = 'rep-resources/';
		this.containerId = "rep-resources";
		this.repResourcePaths = [];
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
				snapshot.forEach((childSnapshot) => { //This iterates over the subclasses in the database.
					elem = ''; //Resetting variable for next iteration.
					this.repResourcePaths.push(childSnapshot.key); //Adding the section title to an array, used for admin to add entries.
					subRefPath = this.refPath +'/'+childSnapshot.key;
					elem += '<h2 class="bold-red meetingMinuteYear">'+childSnapshot.key+'</h2>';
					childSnapshot.forEach((subChildSnapshot) => { //This iterates over all nodes within each subclass currently on in DB.
						subSubRefPath = subRefPath+'/'+subChildSnapshot.key;
						elem += '<p><strong class="meetingMinuteTitle">'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<a href="'+subChildSnapshot.val().fileLink+'" target="_blank">'+ subChildSnapshot.val().fileTitle +'</a><br>'
						if(this.auth.user.isAdmin) { //checks if user is admin
							let deleteButton = this.utils.createButton(subSubRefPath, "Delete", "deleteEntry");
							elem += deleteButton;
						} //end admin if
						elem += '<br>';
					}); //end third DB call
					
					temp = document.createElement("blockquote");
					temp.innerHTML = elem;
					document.getElementById(this.containerId).insertBefore(temp, document.getElementById(this.containerId).firstChild);
					
				
					
				}); //end second Db call
				
				if(this.auth.user.isAdmin) {  //Executes if user is an admin user.
					temp = document.createElement("blockquote");
					let addButton = this.utils.createButton(this.refPath, "Add", "addEntry");
					elem = addButton;
					temp.innerHTML = elem;
					document.getElementById(this.containerId).insertBefore(temp, document.getElementById(this.containerId).firstChild);
					
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
	 * @type {Admin-only}
	 * @param {object} evt
	 * Holds reference to the dom element that fired the event.
	 */
	addMeetingMinutesEvent(evt){
		let options = '';
		evt.preventDefault();
		let modalController = this;
		for(var i=0; i<modalController.repResourcePaths.length; i++){
			options += '<option value="'+modalController.repResourcePaths[i]+'">'+modalController.repResourcePaths[i]+'</option>';
		}
		
		vex.dialog.open({
			message: 'Add Rep Resources',
			input: [
				'<select name="section">',
				options,
				'</select>',
				'<input name="title" type="text" placeholder="Title" required />',
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
					let fileUpload = document.getElementById('uploadFile').files;
					if(fileUpload.length == 1 ) {
						console.log("got into the if statement b4 the function?!?!");
						modalController.addMeetingMinutes(data.section, data.title, fileUpload[0]);
					}
					else{
						vex.dialog.alert("You may only attach one file per Entry!");
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
	
	/*
	 * @type {Admin-only}
	 * @param {String} year
	 *   contains the string for the year entered in modal by admin 
	 * @param {String} title
	 *   contains the string for the title entered in modal by admin
	 * @param {String} subTitle
	 *   contains the string for the subTitle entered in modal by admin
	 * @param {Object} file
	 *   A reference to the file object gathered by input element entered by the admin
	 * @param {Boolean} justAdd
	 */
	addMeetingMinutes(section, title, file){
		let modalController = this;
		this.vexConfirm().then( () => {
			modalController.fileUploadPromise(file).then( (fileObject ) =>{
				firebase.database().ref(this.refPath+'/'+section).push({
					title: title,
					fileTitle: file.name,
					fileLink: fileObject.downloadURL,
					filePath: fileObject.filePath
				}).then( () => {
					vex.dialog.alert('<h3><strong>Successfully added new Entry!</strong></h3>');
					location.reload();
				});
			}).catch((error) => {
				//TODO: add error message in vex, based off error code.
				vex.dialog.alert('<h3><strong>'+error+'</strong></h3>');
				console.log("an Error occurred, Error "+ error);
			})
		}).catch( () => {
			console.log("The promise returned false!!!!");
		});
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
		return year > startYear && year < endYear;
	}
	
	/*
	 * A custom made promise to determine that a file properly uploads
	 * @param {Object} file
	 *   The file the user uploaded
	 */
	fileUploadPromise(file){
		return new Promise((resolve, reject) => {
			let filePath = 'rep-resources/'+file.name;
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
	
	/*
	 * A custom promise for if a user is sure to continue or not.
	 */
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
