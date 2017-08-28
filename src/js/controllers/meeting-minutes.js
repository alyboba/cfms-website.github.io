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
		if(this.auth.user){
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
				elem = '';
				//subRefPath = refPath;
				snapshot.forEach((childSnapshot) => {
					subRefPath = this.refPath;
					subRefPath += '/'+childSnapshot.key;
					//elem += '<blockquote>'; 
					elem += '<h3 class="bold-red meetingMinuteYear">'+childSnapshot.key+'</h3>';
					childSnapshot.forEach((subChildSnapshot) => {
						subSubRefPath = subRefPath+'/'+subChildSnapshot.key;
						elem += '<p><strong class="meetingMinuteTitle">'+subChildSnapshot.val().title+'</strong></p>';
						elem += '<p class="meetingMinuteSubTitle">'+subChildSnapshot.val().subTitle+'</p>';
						if(true) { //TODO: Add check this.auth.user.isAdmin
							//add admin if here
							
							//modalElem = this.utils.populateModalData(subChildSnapshot.val().title, subChildSnapshot.val().subTitle, subSubRefPath);
							//elem += modalElem;
							let updateButton = this.utils.createUpdateButton(subSubRefPath);
							console.log(updateButton);
							elem += updateButton;
							let deleteButton = this.utils.createDeleteButton(subSubRefPath);
							elem += deleteButton;
						} //end admin if here
						elem += '<br><br>';
					});
					//if(true){ //This will be if the user is an admin!
					//	
					//}
					//elem += '</blockquote>';
				});
				temp = document.createElement("blockquote");
				temp.innerHTML = elem;
				document.getElementById('meetingMinutes').appendChild(temp);
				//console.log(this.ModalController);
				
				
				
				if(true) { //TODO: Add check this.auth.user.isAdmin
					this.modalController = new this.ModalController();
					 //end admin if here
					var updateButtons = document.getElementsByClassName("updateEntry");
					for(let i=0; i< updateButtons.length; i++){
						updateButtons[i].addEventListener('click', this.updateMeetingMinutesEvent.bind(this), false);
						
					}
					var deleteButtons = document.getElementsByClassName("deleteEntry");
					for(let i=0; i<deleteButtons.length; i++){
						deleteButtons[i].addEventListener('click', this.deleteMeetingMinutesEvent.bind(this), false);
						
					}
				}
			});
			if(true) {
				//var addEntry = '';
				//addEntry += '<label>Year:</label>';
				//addEntry += '<select><option>2009</option><option>2010</option><option>2011</option><option>2012</option>' +
				//	'<option>2013</option><option>2014</option><option>2015</option><option>2016</option>' +
				//	'<option>2017</option><option>2018</option><option>2019</option><option>2020</option></select><br>';
				//addEntry += '<label>Title:</label>';
				//addEntry += '<input type="text" id="meetingMinuteTitle" /><br>';
				//addEntry += '<label>Sub-Title:</label>';
				//addEntry += '<input type="text" id="meetingMinuteSubTitle" /><br>';
				//addEntry += '<label>File-Link:</label>';
				//addEntry += '<div><input type="file" name="meetingMinuteUpload" id="meetingMinuteFile" class="inputfile" />';
				//addEntry += '<label for="meetingMinuteUpload"><i style="padding-right:8px" class="fa fa-file-o" aria-hidden="true">';
				//addEntry += '</i><span>Choose a file&hellip;</span></label></div>';
				//addEntry += '<div id="file-upload-link" class="file-link"></div>';
				//
				//temp = document.createElement('div');
				//temp.innerHTML = addEntry;
				//document.getElementById('addEntryForm').appendChild(temp);
			}
		}
		
		
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
	}
	deleteMeetingMinutesEvent(evt){
		var dbPath = evt.target.value;
		console.log(dbPath);
		console.log(evt.target.value);
		this.deleteMeetingMinutes(dbPath);
	}
	updateMeetingMinutesEvent(evt){
		var utils = new Utils();
		var modalController = this;
		var dbPath = evt.target.value;
		var title = evt.target.parentElement.getElementsByClassName("meetingMinuteTitle")[0].innerHTML;
		var subTitle = evt.target.parentElement.getElementsByClassName("meetingMinuteSubTitle")[0].innerHTML;
		var year = evt.target.parentElement.getElementsByClassName("meetingMinuteYear")[0].innerHTML;
		vex.dialog.open({
			message: 'Update Values',
			input: [
				'<input name="year" type="text" value="'+year+'" required/>',
				'<input name="title" type="text" placeholder="'+title+'" required />',
				'<input name="subTitle" type="text" placeholder="'+subTitle+'" required />'
			].join(''),
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, { text: 'Update' }),
				$.extend({}, vex.dialog.buttons.NO, { text: 'Back' })
			],
			callback: function (data) {
				if (!data) { //This executes if user clicks back.
					console.log('Cancelled')
				} else { //This executes if user clicks update.
					//Add check that year is a year
					if(data.year === year){
						console.log("Executing when year == year!")
						modalController.updateMeetingMinutes(dbPath, data.title, data.subTitle);
						//Just update the other stuff....
					}
					else{
						console.log("year does not = year.");
						//Check if year entered is proper year
						//Delete old entry @ year,
						//add new entry into database....
						if (modalController.isProperYearRange(data.year, 2000, 2030)) {
							console.log("year is in correct format...");
							modalController.addMeetingMinutes(data.year, data.title, data.subTitle, false);
						} //end if
						else {
							vex.dialog.alert("Year must be between 2000 and 2030");
						}
					}
				} //end else
			} // end vex.open callback
		});
		
	}
	deleteMeetingMinutes(dbPath){
		vex.dialog.confirm({
			message: "Are you sure?",
			callback: (value) =>{
				if(value){
					firebase.database().ref(dbPath).remove().then(() =>{
						document.getElementById('meetingMinutes').innerHTML = "";
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
					});
				}
				else{
					console.log("clicked no");
				}
			}
		});
	}
	
	updateMeetingMinutes(dbPath, title, subTitle){
		console.log(dbPath);
		console.log(title);
		console.log(subTitle);
		vex.dialog.confirm({
			message: "Are you sure?",
			callback: (value) => {
				if (value) {
					//Add a check if year changed....
					//If changed, delete old entry, add new entry with new year.
					firebase.database().ref(dbPath).update({
						title: title,
						subTitle: subTitle,
					}).then(() => {
						document.getElementById('meetingMinutes').innerHTML = "";
						vex.dialog.alert('<h3><strong>Success!</strong></h3>');
					});
				}
				else {
					console.log("clicked no");
				}
			} //end vex confirm callback
		}); //end vex confirm
		
	}
	addMeetingMinutes(year, title, subTitle, justAdd){
		this.vexConfirm().then( () => {
		console.log("The promise is true!");
			firebase.database().ref(this.refPath+'/'+year).push({
			title: title,
			subTitle: subTitle
		}).then( () => {
			if(!justAdd){
				console.log("Going to Delete old entry");
			}
			vex.dialog.alert('<h3><strong>Success!</strong></h3>');
		});
		}).catch( () => {
			console.log("The promise returned false!!!!");
		});
		
		console.log(this.refPath);
	}
	isProperYearRange(year, startYear, endYear){
		return year > startYear && year < endYear;
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



