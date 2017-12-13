import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';
import {format} from 'date-fns';
import {schools, specialties, schoolData, specialtyData} from './dependencies/databases/interview-school-specialties';


//Need to add form sanatizing
//need form validation



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
		this.editKey;
		this.form = null;
		this.process();
		this.eventHandlers();
	}
	
	process() {
		$(document).ready(() =>{
			$('#generalImpression').barrating({
				theme: 'fontawesome-stars'
			});
			$("#qualityEducational, #qualityHospital, #interviewFriendliness, #easeInterview, #locationCultural").barrating({
				theme: 'fontawesome-stars',
				allowEmpty: true
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
	
	eventHandlers(){
		document.getElementById('cancelButton').addEventListener('click', this.cancelFormEvent.bind(this));
		document.getElementById('addSubmitButton').addEventListener('click', this.addInterview.bind(this));
		document.getElementById('editSubmitButton').addEventListener('click', this.editInterview.bind(this));
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
						let upVotes = listing.child('upVotes');
						let downVotes = listing.child('downVotes');
						let upVoteLink = '',
							downVoteLink = '',
							displayVote = true,
							acceptVote = true;
						
						if(listing.val().uid == this.auth.user.identities[0].user_id){ //If entry is users, don't show the votes.
							displayVote = false;
						}
						if(upVotes.numChildren() > 0){
							upVotes.forEach((upVote) => {
								if(upVote.val().uid == this.auth.user.identities[0].user_id){ //If user has voted on this particular one. reject further votes.
									acceptVote = false;
								}
							});
						}
						if(downVotes.numChildren() > 0){
							downVotes.forEach((downVote) => {
								if(downVote.val().uid == this.auth.user.identities[0].user_id){
									acceptVote = false;
								}
							});
						}
						
						if(displayVote){
							if(acceptVote){
								upVoteLink = '<span data-key="'+listing.key+'" class="jrBtn upVote"><span data-key="'+listing.key+'" class="buttonText" style="color:green;">' +
									upVotes.numChildren()+'</span><span data-key="'+listing.key+'" class="icon iconThumbUp"></span></span>';
								
								downVoteLink = '<span data-key="'+listing.key+'" class="jrBtn downVote"><span data-key="'+listing.key+'" class="buttonText" style="color:red;">' +
									downVotes.numChildren()+'</span><span data-key="'+listing.key+'" class="icon iconThumbDown"></span></span>';
								
							}
							else{
								upVoteLink = '<div class="rejectVote up"><span class="jrBtn"><span class="buttonText" style="color:green;">' +
									upVotes.numChildren()+'</span><span class="icon iconThumbUp"></span></span></div>';
								
								downVoteLink = '<div class="rejectVote down"><span class="jrBtn"><span class="buttonText" style="color:red;">' +
									downVotes.numChildren()+'</span><span class="icon iconThumbDown"></span></span></div>';
								
							}
						}

						
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
							delTemp,
							upVoteLink,
							downVoteLink
						];
						let data = [
							listing.val().interviewSetting ? listing.val().interviewSetting : '',
							listing.val().howDidPrepare ? listing.val().howDidPrepare : '',
							listing.val().generalComments ? listing.val().generalComments : '',
							listing.val().mostInterestingDifficultQuestion ? listing.val().mostInterestingDifficultQuestion : '',
							listing.val().positiveAspects ? listing.val().positiveAspects : '',
							listing.val().negativeAspects ? listing.val().negativeAspects : '',
							listing.val().lessonsLearned ? listing.val().lessonsLearned : ''
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
					let upVoteButtons = document.getElementsByClassName('upVote');
					for (let i = 0; i < upVoteButtons.length; i++) {
						upVoteButtons[i].addEventListener('click', this.upVoteEvent.bind(this), false);
					}
					let downVoteButtons = document.getElementsByClassName('downVote');
					for (let i = 0; i < downVoteButtons.length; i++) {
						downVoteButtons[i].addEventListener('click', this.downVoteEvent.bind(this), false);
					}
					let rejectVoteButtons = document.getElementsByClassName('rejectVote');
					for (let i = 0; i < rejectVoteButtons.length; i++) {
						rejectVoteButtons[i].addEventListener('click', this.rejectVoteEvent.bind(this), false);
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
	
	upVoteEvent(evt){
		let key = evt.target.getAttribute('data-key');
		this.submitVote(key, true);
	}
	
	downVoteEvent(evt){
		let key = evt.target.getAttribute('data-key');
		this.submitVote(key, false);
	}
	
	rejectVoteEvent(evt){
		this.utils.displayVexAlert("You have Already voted on this entry!");
	}
	
	submitVote(key, voteUp){
		let voteString = voteUp ? 'upVotes' : 'downVotes';
		this.dbRef.child(key).child(voteString).push({
			uid: this.auth.user.identities[0].user_id
		}).then(() =>{
			this.utils.displayVexAlert('Thank you for your Vote!');
		}).catch((err) =>{
			this.utils.displayVexAlert(err);
		});
	}
	
	editDatabaseEntry(evt){
		evt.preventDefault();
		$('#addSubmitButton').hide();
		$('#editSubmitButton').show();
		this.displayForm();
		let key = evt.target.getAttribute('id');
		this.editKey = key;
		this.dbRef.child(key).once('value', (snapshot) => {
			$('#interviewSetting').val(snapshot.val().interviewSetting);
			$('#prepare').val(snapshot.val().howDidPrepare);
			$('#generalComments').val(snapshot.val().generalComments);
			$('#mostInterestingQuestion').val(snapshot.val().mostInterestingDifficultQuestion);
			$('#positiveAspects').val(snapshot.val().positiveAspects);
			$('#negativeAspects').val(snapshot.val().negativeAspects);
			$('#lessonsLearned').val(snapshot.val().lessonsLearned);
			$('#generalImpression').val(snapshot.val().generalImpression);
			$('#qualityHospital').val(snapshot.val().qualityHospital);
			$('#qualityEducational').val(snapshot.val().qualityEducation);
			$('#interviewFriendliness').val(snapshot.val().interviewFriendliness);
			$('#easeInterview').val(snapshot.val().easeInterview);
			$('#locationCultural').val(snapshot.val().locationCultural);
		});
	}
	
	editInterview(evt){
		evt.preventDefault();
		let updateObj = this.createFormObject();
		this.dbRef.child(this.editKey).update(updateObj)
			.then(()=>{
				this.utils.displayVexAlert('Successfully Updated Entry');
				this.closeForm();
			}).catch((err) =>{
				this.utils.displayVexAlert(err);
		});

	}
	
	
	addInterview(evt){
		evt.preventDefault();
		let addObj = this.createFormObject();
		this.dbRef.push(addObj)
		.then(() => {
			this.utils.displayVexAlert('Successfully Added Entry');
			this.closeForm();
		}).catch((err) => {
			this.utils.displayVexAlert(err);
		});
	}
	
	createFormObject(){
		let starInfo = this.calculateStarRating(),
			starRatings = starInfo.starRatings,
			totalStars = starInfo.totalStars,
			overallImpression = totalStars/starRatings,
			username,
			uid = this.auth.user.identities[0].user_id,
			dateReviewed = format(new Date(), 'MMMM Do, YYYY @ hh:mmA (Z)'),
			anonymousReview = $('#anonymous:checked').val() == 'yes' ? true : false;
		
		overallImpression = overallImpression.toFixed(2);
		
		if(!anonymousReview){
			username = this.auth.user.given_name; // + ' ' + this.auth.user.family_name; //Should this just be first name or first/last?
		}
		else{
			username = 'Anonymous Reviewer';
		}
		let obj = {
			generalImpression: $('#generalImpression').val(),
			qualityHospital: $('#qualityHospital').val(),
			qualityEducation: $('#qualityEducational').val(),
			interviewFriendliness: $('#interviewFriendliness').val(),
			easeInterview: $('#easeInterview').val(),
			locationCultural: $('#locationCultural').val(),
			reviewedBy: username,
			dateReviewed: dateReviewed,
			overallRating: overallImpression,
			interviewSetting: $('#interviewSetting').val(),
			howDidPrepare: $('#prepare').val(),
			generalComments: $('#generalComments').val(),
			mostInterestingDifficultQuestion: $('#mostInterestingQuestion').val(),
			positiveAspects: $('#positiveAspects').val(),
			negativeAspects: $('#negativeAspects').val(),
			lessonsLearned: $('#lessonsLearned').val(),
			uid: uid
		};
		//Sanatize the data to remove malicious injected code.
		for(const prop in obj){
			obj[prop] = this.utils.sanatizeInput(obj[prop]);
		}
		return obj;
	}
	
	deleteDatabaseEntryEvent(evt) {
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		this.utils.vexConfirm().then(() => {
			this.delEntry(dbPath);
		});
	}
	
	delEntry(dbPath) {
		this.firebase.database().ref(dbPath).remove()
			.then(() => {
				this.utils.displayVexAlert("Successfully Deleted Entry");
				this.closeForm();
			}).catch((err) => {
			this.utils.displayVexAlert(err);
		});
	}
	
	cancelFormEvent(evt){
		evt.preventDefault();
		this.closeForm();
	}
	
	closeForm(){
		let form = this.form;
		this.form.removeClass('fadeInDown');
		this.form.addClass('fadeOutUp');
		setTimeout(function(){
			form.addClass('hidden');
		}, 750);
	}
	
	expandEvent(evt) {
		console.log(this);
		console.log(evt);
		let tr = $(evt.target).closest('tr');
		let row = this.table.row(tr);
		if (row.child.isShown()) {
			row.child.hide();
			tr.removeClass('shown');
		}
		else {
			row.child.show();
			tr.addClass('shown');
		}
	}
	
	clickAddEntryButton(evt){
		evt.preventDefault();
		document.getElementById('dataForm').reset();
		$("#generalImpression, #qualityEducational, #qualityHospital, #interviewFriendliness, #easeInterview, #locationCultural").barrating('clear');
		$('#editSubmitButton').hide();
		$('#addSubmitButton').show();
		this.displayForm();
	}
	
	displayForm(){
		this.form.removeClass("hidden");
		this.form.removeClass("fadeOutUp");
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
		let str = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
		str += infoArray[0] == '' ? '' : '<tr>' +
			'<td><strong>Interview Setting</strong></td>' +
			'<td>' + infoArray[0] + '</td>' +
			'</tr>';
		
		str += infoArray[1] == '' ? '' : '<tr>' +
			'<td><strong>How Did you Prepare for the Interview?:</strong></td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>';
		
		str += infoArray[2] == '' ? '' : '<tr>' +
			'<td><strong>General Comments About the Interview:</strong></td>' +
			'<td>' + infoArray[2] + '</td>' +
			'</tr>';
		
		str += infoArray[3] == '' ? '' : '<tr>' +
			'<td><strong>Most Interesting or Difficult Question:</strong></td>' +
			'<td>' + infoArray[3] + '</td>' +
			'</tr>';
		
		str += infoArray[4] == '' ? '' : '<tr>' +
			'<td><strong>Positive Aspects of the Interview:</strong></td>' +
			'<td>' + infoArray[4] + '</td>' +
			'</tr>';
		
		str += infoArray[5] == '' ? '' : '<tr>' +
			'<td><strong>Negative Aspects of the Interview:</strong></td>' +
			'<td>' + infoArray[5] + '</td>' +
			'</tr>';
		
		str += infoArray[6] == '' ? '' : '<tr>' +
			'<td><strong>Lessons Learned/Advice for Future Applicants:</strong></td>' +
			'<td>' + infoArray[6] + '</td>' +
			'</tr>';
		str += '</table>';
		return str;
	}
	
	calculateStarRating(){
		let starRatings = 1;
		let totalStars =  Math.floor($('#generalImpression').val());
		if($('#qualityHospital').val()){
			totalStars += Math.floor($('#qualityHospital').val());
			starRatings++;
		}
		if($('#qualityEducational').val()){
			totalStars += Math.floor($('#qualityEducational').val());
			starRatings++;
		}
		if($('#interviewFriendliness').val()){
			totalStars += Math.floor($('#interviewFriendliness').val());
			starRatings++;
		}
		
		if($('#easeInterview').val()){
			totalStars += Math.floor($('#easeInterview').val());
			starRatings++;
		}
		if($('#locationCultural').val()){
			totalStars += Math.floor($('#locationCultural').val());
			starRatings++;
		}
		
		let obj = {
			starRatings: starRatings,
			totalStars: totalStars
		};
		return obj;
	}
}