import { FirebaseConnection } from '../repositories/firebase/utils';

export default class LoginController extends FirebaseConnection{
	constructor() {
		super();
		this.process();
	}
	
	process(){
		var controller = this;
		var firebase = this.firebase;
		var storageRef = firebase.storage().ref();
				
		/**
		 * Handles the submit application button press
		 */
		window.submitApplication = function() {
			//Email Verification
			var emailAddress = document.getElementById('email-address').value;
			if (emailAddress.length < 4) {
				vex.dialog.alert('<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>');
				return;
			}
			
			//CMA Membership verification
			var cmaMembershipID = document.getElementById('cma-membership').value;
			if (cmaMembershipID.length !== 6 || !controller.isInt(cmaMembershipID)){
				vex.dialog.alert('<h3><strong>Invalid CMA Membership ID</strong></h3><p>Your CMA Membership ID should be a 6 digit number.</p>');
				return;
			}
			
			//Ensures that every necessary file is present
			var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid;
			firebase.database().ref(refPath).once('value').then(function(snapshot) {
				if (!snapshot.child('personalStatement').exists()
					|| !snapshot.child('curriculumVitae').exists()
					|| !snapshot.child('letterGoodStanding').exists()
					|| !snapshot.child('reference1').exists()
					|| !snapshot.child('reference2').exists()){
					vex.dialog.alert('<h3><strong>Missing Supporting Document</strong></h3><p>You are missing a supporting document.</p>');
					return;
				}
				
				//Twitter Handle sanitization
				var twitterHandle = document.getElementById('twitter-handle').value;
				if (twitterHandle.charAt(0) !== '@')
					twitterHandle = '@' + twitterHandle;
				if (twitterHandle.length === 1 && twitterHandle.charAt(0) === '@')
					twitterHandle = '';
				
				//Meeting Attendance conversion to yes/no.
				var meetingAttendance = document.getElementById('attend-cfms-meeting').value;
				if (meetingAttendance.charAt(0) === 'Y')
					meetingAttendance = "Yes";
				else
					meetingAttendance = "No";
				
				//Saves the submission data into the database
				firebase.database().ref(refPath).update({
					submitted:true,
					name:document.getElementById('account-name').textContent,
					medicalSchool:document.getElementById('account-school').textContent,
					graduationYear:document.getElementById('account-grad-year').textContent,
					emailAddress:emailAddress,
					cmaMembershipID:cmaMembershipID,
					twitterHandle:twitterHandle,
					meetingAttendance:meetingAttendance,
					dateSubmitted:controller.getTimeEST(),
					linkPersonalStatement:document.getElementById('personal-statement-link').childNodes[0].href,
					linkCurriculumVitae:document.getElementById('curriculum-vitae-link').childNodes[0].href,
					linkLetterGoodStanding:document.getElementById('letter-good-standing-link').childNodes[0].href,
					linkReference1:document.getElementById('reference-1-link').childNodes[0].href,
					linkReference2:document.getElementById('reference-2-link').childNodes[0].href,
				});
				
				//Displays success dialog
				vex.dialog.alert('<h3><strong>Application Submitted</strong></h3><p>Congratulations! You have successfully submitted your application.</p>');
				
				//Loads the submission fields
				controller.loadSubmission ();
			}); //End firebase call.
		} //End submitApplication
	}

	
	/**
	 * Deletes files with a given path
	 */
	deleteFile (filePath){
		var storageRef = this.firebase.storage().ref();
		storageRef.child(filePath).delete().then(function() {
			//File deleted successfully
		}).catch(function(error){
			console.log("DELETE " + error);
			return error;
		});
	}
	
	
	isInt (cmaMembershipID){
		for (var i = 0; i < cmaMembershipID.length; i++){
			var currentChar = cmaMembershipID.charAt(i);
			if (currentChar < '0' || currentChar > '9')
				return false;
		}
		return true;
	} //end isInt
	
	getTimeEST(){
		//EST
		let offset = -4.0; //Changed this to -4, when offset = 1 = greenwich time therefore since Est is -5, 1-5 = -4 
		//OR if that doesn't make since EST is 4 hours behind UTC time not 5, therefore -4
		let clientDate = new Date();
		let utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
		let serverDate = new Date(utc + (3600000*offset));
		return (serverDate.toLocaleString());
	}
	
	/**
	 * Displays the submitted application for the currentUser
	 */
	loadSubmission (){
		var storageRef = this.firebase.storage().ref();
		//Loads user-associated data
		var refPath = '/users/' + this.firebase.auth().currentUser.uid;
		this.firebase.database().ref(refPath).once('value').then(function(snapshot) {
			var firstName = snapshot.val().firstName;
			var lastName = snapshot.val().lastName;
			document.getElementById('submitted-name').textContent = firstName + ' ' + lastName;
			document.getElementById('submitted-school').textContent = snapshot.val().medicalSchool;
			document.getElementById('submitted-grad-year').textContent = snapshot.val().graduationYear;
		});
		
		//Loads other submitted data
		refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + this.firebase.auth().currentUser.uid;
		this.firebase.database().ref(refPath).once('value').then(function(snapshot) {
			if (!snapshot.child('submitted').exists())
				return;
			document.getElementById('submitted-email').textContent = snapshot.val().emailAddress;
			document.getElementById('submitted-cma-id').textContent = snapshot.val().cmaMembershipID;
			var twitterHandle = snapshot.val().twitterHandle;
			if (twitterHandle === '')
				document.getElementById('submitted-twitter-handle').textContent = 'Not given';
			else
				document.getElementById('submitted-twitter-handle').innerHTML = '<a href="https://twitter.com/' + twitterHandle.substring(1) + '" target="_blank">' + twitterHandle + '</a>';
			document.getElementById('submitted-attending-sgm').textContent = snapshot.val().meetingAttendance;
			document.getElementById('submitted-date-time').textContent = snapshot.val().dateSubmitted;
			
			//Loads submitted files
			storageRef.child(refPath + '/personal-statement/' + snapshot.val().personalStatement).getDownloadURL().then(function(url) {
				document.getElementById('submitted-personal-statement').href = url;
			}).catch(function(error) {
				// File doesn't exist
			});
			storageRef.child(refPath + '/curriculum-vitae/' + snapshot.val().curriculumVitae).getDownloadURL().then(function(url) {
				document.getElementById('submitted-curriculum-vitae').href = url;
			}).catch(function(error) {
				// File doesn't exist
			});
			storageRef.child(refPath + '/letter-good-standing/' + snapshot.val().letterGoodStanding).getDownloadURL().then(function(url) {
				document.getElementById('submitted-letter-good-standing').href = url;
			}).catch(function(error) {
				// File doesn't exist
			});
			storageRef.child(refPath + '/reference-1/' + snapshot.val().reference1).getDownloadURL().then(function(url) {
				document.getElementById('submitted-reference-1').href = url;
			}).catch(function(error) {
				// File doesn't exist
			});
			storageRef.child(refPath + '/reference-2/' + snapshot.val().reference2).getDownloadURL().then(function(url) {
				document.getElementById('submitted-reference-2').href = url;
			}).catch(function(error) {
				// File doesn't exist
			});
		});
		
		//Hides the submission form and displays the application
		var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
		for (var i = 0; i < beforeSubmissionElements.length; i ++)
			beforeSubmissionElements[i].style.display = 'none';
		var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
		for (var i = 0; i < afterSubmissionElements.length; i ++)
			afterSubmissionElements[i].style.display = 'block';
	} //End loadSubmission
	
	/**
	 * Updates files uploaded for the Leadership Awards
	 */
	handleFileSelect(evt) {
		console.log("handle file select event firing!!");
		//Uncomment this when ready for testing!
		
		
		// let controller = this;
		// var storageRef = this.firebase.storage().ref();
		// evt.stopPropagation();
		// evt.preventDefault();
		// var file = evt.target.files[0];
		// var metadata = {
		// 	'contentType': file.type
		// };
		//
		// //Deletes the previous version of file, if it exists
		// //--------------------------------------------
		// var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + this.firebase.auth().currentUser.uid;
		// this.firebase.database().ref(refPath).once('value').then(function(snapshot) {
		// 	var deletePath = refPath + '/' + evt.target.id + '/';
		// 	switch(evt.target.id) {
		// 		case 'personal-statement':
		// 			if (snapshot.child('personalStatement').exists())
		// 				controller.deleteFile (deletePath + snapshot.val().personalStatement);
		// 			break;
		// 		case 'curriculum-vitae':
		// 			if (snapshot.child('curriculumVitae').exists())
		// 				controller.deleteFile (deletePath + snapshot.val().curriculumVitae);
		// 			break;
		// 		case 'letter-good-standing':
		// 			if (snapshot.child('letterGoodStanding').exists())
		// 				controller.deleteFile (deletePath + snapshot.val().letterGoodStanding);
		// 			break;
		// 		case 'reference-1':
		// 			if (snapshot.child('reference1').exists())
		// 				controller.deleteFile (deletePath + snapshot.val().reference1);
		// 			break;
		// 		case 'reference-2':
		// 			if (snapshot.child('reference2').exists())
		// 				controller.deleteFile (deletePath + snapshot.val().reference2);
		// 			break;
		// 	}
		//	
		// 	//Add the new version of the file
		// 	//--------------------------------------------
		// }).then (function() {
		// 	// Push to child path.
		// 	// [START oncomplete]
		// 	refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid + '/' + evt.target.id;
		// 	storageRef.child(refPath + '/' + file.name).put(file, metadata).then(function(snapshot) {
		// 		var url = snapshot.metadata.downloadURLs[0];
		// 		controller.setFileLink (evt.target.id, url);
		// 	}).catch(function(error) {
		// 		// [START onfailure]
		// 		vex.dialog.alert('<h3><strong>Upload failed</strong></h3><p>' + error + '</p>');
		// 		// [END onfailure]
		// 	});
		// 	// [END oncomplete]
		//	
		// 	//Copies filenames of uploaded files onto database
		// 	//--------------------------------------------
		// }).then (function(){
		// 	refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid;
		// 	switch(evt.target.id) {
		// 		case 'personal-statement':
		// 			this.firebase.database().ref(refPath).update({
		// 				personalStatement:file.name
		// 			})
		// 			break;
		// 		case 'curriculum-vitae':
		// 			this.firebase.database().ref(refPath).update({
		// 				curriculumVitae:file.name
		// 			})
		// 			break;
		// 		case 'letter-good-standing':
		// 			this.firebase.database().ref(refPath).update({
		// 				letterGoodStanding:file.name
		// 			})
		// 			break;
		// 		case 'reference-1':
		// 			this.firebase.database().ref(refPath).update({
		// 				reference1:file.name
		// 			})
		// 			break;
		// 		case 'reference-2':
		// 			this.firebase.database().ref(refPath).update({
		// 				reference2:file.name
		// 			})
		// 			break;
		// 	}
		// });
	} //End handle fileSelect
	
	
}