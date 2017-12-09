import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';
import {schools, specialties, schoolData, specialtyData} from './dependencies/databases/interview-school-specialties';


export default class CarmsInterviewController extends FirebaseConnection {
	constructor(authService) {
		super();
		this.utils = new Utils();
		this.auth = authService;
		this.refPath = 'interviews/';
		this.specialtyRefPath = null;
		this.schoolRefPath = null;
		this.dbRef;
		this.specialty = null;
		this.school = null;
		this.userName = null;
		this.userId = null;
		this.schools = schools;
		this.specialties = specialties;
		this.schoolSpecialtyHash = schoolData;
		this.specialtySchoolHash = specialtyData;
		this.table;
		this.form = null;
		this.process();
	}
	
	process() {
		$(document).ready(() =>{
			$("#generalImpression, #qualityEducational, #qualityHospital, #interviewFriendliness, #easeInterview, #locationCultural").barrating({
				theme: 'fontawesome-stars'
			});
			this.form = $('#dataForm');
		});
		
		
		if (this.auth.user) {
			//Initially populate our lists with the schools and list from data pulled in.
			this.createList(this.schools, 'schools-list', 'School');
			this.createList(this.specialties, 'specialties-list', 'Specialty');
			this.table = $('#interviewsDatabase').DataTable({
				"columnDefs": [
					{className: "details-control", "targets": [0]}
				]
			}); //Initializing dataTables.
			
			
			//Handle when user changes schools list
			$('#schools-list').change((evt) => {
				let specialtyValue = $('#specialties-list').find(":selected").val();
				console.log(specialtyValue);
				let value = evt.target.value;
				if (value == "notSelected") {
					this.createList(this.specialties, 'specialties-list', 'Specialty');
					this.schoolRefPath = null;
					document.getElementById('addButton').innerHTML = "";
				}
				else {
					let specialties = this.schoolSpecialtyHash.filter((list) => list.school === value).map((list) => list.specialties);
					this.handleListChange('specialties-list', specialties, this.specialties, 'Specialty');
					this.schoolRefPath = value;
				}
				$('#specialties-list').val(specialtyValue);
				this.populateTable();
			});
			
			//Handle when user changes specialties list.
			$('#specialties-list').change((evt) => {
				let schoolValue = $('#schools-list').find(":selected").val();
				console.log(schoolValue);
				let value = evt.target.value;
				if(value == "notSelected"){
					this.createList(this.schools, 'schools-list', 'School');
					this.specialtyRefPath = null;
					document.getElementById('addButton').innerHTML = "";
				}
				else {
					let schools = this.specialtySchoolHash.filter((list) => list.specialty === value).map((list) => list.schools);
					this.handleListChange('schools-list', schools, this.schools, 'School');
					this.specialtyRefPath = value;
				}
				$('#schools-list').val(schoolValue);
				this.populateTable();
			});
		}
	}
	
	populateTable(){
		if(this.specialtyRefPath && this.schoolRefPath){ //Make sure user has selected both options.
			this.table.clear().draw();
			this.createAddButton();
			let refPath = this.refPath + this.specialtyRefPath + '/' + this.schoolRefPath;
			this.dbRef = this.firebase.database().ref(this.refPath).child(`${this.specialtyRefPath}/${this.schoolRefPath}`);
			this.dbRef.on('value', (snapshot) => {
				this.table.clear();
				if(snapshot.hasChildren()){
					snapshot.forEach((listing) => {
						let delTemp = '',
							editTemp = '';
						
						if(this.auth.user.isAdmin || listing.val().uid == this.auth.user.identities[0].user_id){
							let editButton = this.utils.createWithIdButton(refPath + '/' + listing.key, 'Edit', listing.key, 'editEntry');
							editTemp = editButton;
							let delButton = this.utils.createButton(refPath + '/' + listing.key, "Del", 'delEntry');
							delTemp = delButton;
						}
						
						let row = [
							'',
							listing.val().reviewedBy,
							listing.val().dateReviewed,
							listing.val().overallRating,
							editTemp,
							delTemp
						];
						let data = [
							listing.val().interviewSetting,
							listing.val().howDidPrepare,
							listing.val().generalComments,
							listing.val().mostInterestingDifficultQuestion,
							listing.val().positiveAspects,
							listing.val().negativeAspects,
							listing.val().lessonsLearned
						];
						this.table.row.add(row).child(this.formatExpand(data)).draw(false); //Create row and a child underneath it.
					});
					
					let expandButtons = document.getElementsByClassName('details-control');
					for (let i = 0; i < expandButtons.length; i++) {
						expandButtons[i].addEventListener('click', this.expandEvent.bind(this), false);
					}
					//This needs to be inside the observable so isn't called off race condition..
					let delButtons = document.getElementsByClassName('delEntry');
					for (let i = 0; i < delButtons.length; i++) {
						delButtons[i].addEventListener('click', this.deleteDatabaseEntryEvent.bind(this), false);
					}
					let editButtons = document.getElementsByClassName('editEntry');
					for (let i = 0; i < editButtons.length; i++) {
						editButtons[i].addEventListener('click', this.editDatabaseEntry.bind(this), false);
					}
					
				}
				else {
					this.table.clear().draw(); //NO data available, so clear it all out and redraw it..
				}
			});
		}
		else {
			this.table.clear();
		}
	}
	
	clickAddEntryButton(evt){
		evt.preventDefault();
		let refPath = evt.target.getAttribute("src");
		console.log(refPath);
		console.log(evt.target);
		console.log(this.form);
		this.form.removeClass("hidden");
		this.form.addClass("animated fadeInDown");
	}
	
		
	handleListChange(id, array, list, name) {
		if (array.length > 0) {
			this.createList(array[0], id, name);
		}
		else {
			this.createList(list, id, name);
		}
	}
	
	createList(array, id, name) {
		let listEditing = document.getElementById(id);
		let list = array.reduce((previous, current) => {
			return previous + '<option value="' + current + '">' + current + '</option>';
		}, '<option selected value="notSelected"> -- Select a ' + name + ' -- </option>');
		listEditing.innerHTML = list;
	}
	
	createAddButton() {
		document.getElementById('addButton').innerHTML = '';
		let temp = document.createElement('div');
		let addButton = this.utils.createButton((this.refPath + this.specialtyRefPath + '/' + this.schoolRefPath), "Add Entry", "addEntry");
		temp.innerHTML = addButton;
		document.getElementById('addButton').appendChild(temp);
		let button = document.getElementsByClassName('addEntry');
		button[0].addEventListener('click', this.clickAddEntryButton.bind(this), false);
	}
	
	formatExpand(infoArray) {
		return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
			'<tr>' +
			'<td>Interview Setting</td>' +
			'<td>' + infoArray[0] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>How Did you Prepare for the Interview?:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>General Comments About the Interview:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Most Interesting or Difficult Question:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Positive Aspects of the Interview:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Negative Aspects of the Interview:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Lessons Learned/Advice for Future Applicants:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'</table>';
	}
		
}