<script type="text/javascript">
	var storageRef = firebase.storage().ref();
	var accountJustCreated = false;

	function isSignedIn () {
		return (firebase.auth().currentUser);
	}
	/**
	 * Handles the sign in button press.
	 */
	function toggleSignIn() {
		if (firebase.auth().currentUser){
			firebase.auth().signOut();
		}
		else {
			var email = document.getElementById('login-email').value;
			var password = document.getElementById('login-password').value;

			// Sign in with email and pass.
			firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;

				if (errorCode === 'auth/wrong-password')
					vex.dialog.alert('<h3><strong>Wrong Password</strong></h3><p>You have entered an incorrect password.</p>')
				else
					vex.dialog.alert('<h3><strong>Something went wrong</strong></h3><p>' + errorMessage + '</p>');
				document.getElementById('login-button').disabled = false;
			});
		}
		document.getElementById('login-button').disabled = true;
	}

	/**
	 * Handles the sign up button press.
	 */
	function handleSignUp() {
		var email = document.getElementById('account-email').value;
		var password = document.getElementById('account-password-first').value;
		var passwordAgain = document.getElementById('account-password-second').value;
		var authenticationCode = document.getElementById('account-authentication-code').value;
		if (password !== passwordAgain){
			vex.dialog.alert('<h3><strong>Passwords do not Match</strong></h3><p>Please try again.</p>');
			return;
		}
	    if (email.length < 4) {
	    	vex.dialog.alert('<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>');
	        return;
	    }
		if (password.length < 7) {
			vex.dialog.alert('<h3><strong>Weak Password</strong></h3><p>Please ensure that your password is at least 7 characters.</p>')
			return;
		}
		if (authenticationCode !== '{{ site.authentication_code }}'){
			vex.dialog.alert('<h3><strong>Incorrect Authentication Code</strong></h3><p>The Authentication Code is incorrect.</p>')
			return;
		}

		// Sign in with email and pass.
		firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode == 'auth/weak-password')
				vex.dialog.alert('<h3><strong>Weak Password</strong></h3><p>The password is too weak.</p>')
			else
				vex.dialog.alert('<h3><strong>Something went wrong</strong></h3><p>' + errorMessage + '</p>');
		});
		vex.dialog.alert('<h3><strong>Account Successfully Created</strong></h3><p>Your account has successfully been created! You are now logged in. Welcome to the CFMS!</p>')
		accountJustCreated = true;
	}

	function sendPasswordReset() {
		var email = document.getElementById('reset-email-address').value;
		firebase.auth().sendPasswordResetEmail(email).then(function() {
			// Password Reset Email Sent!
			vex.dialog.alert('<h3><strong>Password Reset Email Sent</strong></h3><p>Your Password Reset Email has been sent. Please check your inbox.</p>')
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;

			if (errorCode == 'auth/invalid-email')
				vex.dialog.alert('<h3><strong>Invalid Email</strong></h3><p>The email address that you entered is invalid.</p>')
			else if (errorCode == 'auth/user-not-found')
				vex.dialog.alert('<h3><strong>User Not Found</strong></h3><p>The email address that you entered does not match a user on our system.</p>')
		});
	}

	/** 
	* Deletes files with a given path
	*/
	function deleteFile (filePath){
		storageRef.child(filePath).delete().then(function() {
			//File deleted successfully
		}).catch(function(error){
			console.log("DELETE " + error);
			return error;
		});
	}

	/** 
	* Sets the file link from the target id to the correct url
	*/
	function setFileLink (id, url){
		document.getElementById(id+'-link').innerHTML = '<a href="' +  url + '" target="_blank">View File</a>';
	}

	function loadPrevFile (refPath, id, fileName){
		//Set the button to show the file name
		input = document.getElementById (id);
		label = input.nextElementSibling;
		label.querySelector( 'span' ).innerHTML = fileName;

		//Set the URL to display by the button
		storageRef.child(refPath + '/' + id + '/' + fileName).getDownloadURL().then(function(url) {
			setFileLink (id, url);
		}).catch(function(error) {
		  // File doesn't exist
		});
	}

	/**
	* Updates files uploaded for the Leadership Awards
	*/
	function handleFileSelect(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var file = evt.target.files[0];
		var metadata = {
			'contentType': file.type
		};

		//Deletes the previous version of file, if it exists
		//--------------------------------------------
		var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid;
		firebase.database().ref(refPath).once('value').then(function(snapshot) {
			var deletePath = refPath + '/' + evt.target.id + '/';
			switch(evt.target.id) {
			    case 'personal-statement':
			    	if (snapshot.child('personalStatement').exists())
				    	deleteFile (deletePath + snapshot.val().personalStatement);
			    	break;
			    case 'curriculum-vitae':
			    	if (snapshot.child('curriculumVitae').exists())
				    	deleteFile (deletePath + snapshot.val().curriculumVitae);
			    	break;
			    case 'letter-good-standing':
			    	if (snapshot.child('letterGoodStanding').exists())
				    	deleteFile (deletePath + snapshot.val().letterGoodStanding);
			    	break;
			    case 'reference-1':
			    	if (snapshot.child('reference1').exists())
				    	deleteFile (deletePath + snapshot.val().reference1);
			    	break;
			    case 'reference-2':
			    	if (snapshot.child('reference2').exists())
				    	deleteFile (deletePath + snapshot.val().reference2);
				    break;
			}

		//Add the new version of the file
		//--------------------------------------------
		}).then (function() {
			// Push to child path.
			// [START oncomplete]
			refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid + '/' + evt.target.id;
			storageRef.child(refPath + '/' + file.name).put(file, metadata).then(function(snapshot) {
				var url = snapshot.metadata.downloadURLs[0];
				setFileLink (evt.target.id, url);
			}).catch(function(error) {
				// [START onfailure]
				vex.dialog.alert('<h3><strong>Upload failed</strong></h3><p>' + error + '</p>');
				// [END onfailure]
			});
			// [END oncomplete]

		//Copies filenames of uploaded files onto database
		//--------------------------------------------
		}).then (function(){
			refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid;
			switch(evt.target.id) {
			    case 'personal-statement':
					firebase.database().ref(refPath).update({
						personalStatement:file.name
					})
					break;
			    case 'curriculum-vitae':
			    	firebase.database().ref(refPath).update({
				    	curriculumVitae:file.name
				    })
			        break;
			    case 'letter-good-standing':
			    	firebase.database().ref(refPath).update({
				    	letterGoodStanding:file.name
				    })
			    	break;
			    case 'reference-1':
			    	firebase.database().ref(refPath).update({
				    	reference1:file.name
				    })
			    	break;
			    case 'reference-2':
			    	firebase.database().ref(refPath).update({
				    	reference2:file.name
				    })
				    break;
			}
		});
	}

	function isInt (cmaMembershipID){
		for (var i = 0; i < cmaMembershipID.length; i++){
			var currentChar = cmaMembershipID.charAt(i);
			if (currentChar < '0' || currentChar > '9')
				return false;
		}
		return true;
	}

	function getTimeEST(){
	    //EST
	    offset = -5.0;
	    clientDate = new Date();
	    utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
	    serverDate = new Date(utc + (3600000*offset));
	    return (serverDate.toLocaleString());
	}

	/**
	 * Displays the submitted application for the currentUser
	 */
	function loadSubmission (){

		//Loads user-associated data
		var refPath = '/users/' + firebase.auth().currentUser.uid;
		firebase.database().ref(refPath).once('value').then(function(snapshot) {
			var firstName = snapshot.val().firstName;
			var lastName = snapshot.val().lastName;
			document.getElementById('submitted-name').textContent = firstName + ' ' + lastName;
			document.getElementById('submitted-school').textContent = snapshot.val().medicalSchool;
			document.getElementById('submitted-grad-year').textContent = snapshot.val().graduationYear;
		});

		//Loads other submitted data
		refPath = 'leadership-award/' + '{{ site.leadership_award_years }}/' + firebase.auth().currentUser.uid;
		firebase.database().ref(refPath).once('value').then(function(snapshot) {
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
	}

	/**
	 * Handles the submit application button press
	 */
	function submitApplication() {
		//Email Verification
		var emailAddress = document.getElementById('email-address').value;
		if (emailAddress.length < 4) {
	    	vex.dialog.alert('<h3><strong>Enter an Email Address</strong></h3><p>Please enter an email address.</p>');
	        return;
	    }

		//CMA Membership verification
		var cmaMembershipID = document.getElementById('cma-membership').value;
		if (cmaMembershipID.length !== 6 || !isInt(cmaMembershipID)){
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
		});

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
			dateSubmitted:getTimeEST()
		});

		//Displays success dialog
		vex.dialog.alert('<h3><strong>Application Submitted</strong></h3><p>Congratulations! You have successfully submitted your application.</p>');

		//Loads the submission fields
		loadSubmission ();
	}

	/**
	 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
	 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
	 *    out, and that is where we update the UI.
	 */
	function initApp() {
		// Listening for auth state changes.
		firebase.auth().onAuthStateChanged(function(user) {

			if (accountJustCreated){
				var firstName = document.getElementById('account-first-name').value;
				var lastName = document.getElementById('account-last-name').value;
				var medicalSchool = document.getElementById('account-medical-school').value;
				var graduationYear = document.getElementById('account-graduation-year').value;
				firebase.database().ref('users/' + user.uid).set({
				    firstName: firstName,
				    lastName: lastName,
				    medicalSchool: medicalSchool,
				    graduationYear: graduationYear,
				    isAdmin: false
				})
				accountJustCreated = false;
			}
			{% for nav in site.data.translations.nav %}
				{% if nav.lang == page.lang %}
					if (user) {
						// User is signed in.
						document.getElementById('login-button').textContent = '{{ nav.logout }}';
						document.getElementById('members').style.display = 'inline';

						//Show all member-only elements
						var memberElements = document.getElementsByClassName('members-only'), i;
						for (var i = 0; i < memberElements.length; i ++)
							memberElements[i].style.display = 'block';
						//Hide all non-member elements
						var nonMemberElements = document.getElementsByClassName('non-members'), i;
						for (var i = 0; i < nonMemberElements.length; i ++)
							nonMemberElements[i].style.display = 'none';
						//Enable file uploads
						var fileUploaders = document.getElementsByClassName('inputfile'), i;
						for (var i = 0; i < fileUploaders.length; i ++)
							fileUploaders[i].disabled = false;
						//Show admin elements if is admin
						firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
							if(snapshot.val().isAdmin === true){
								var adminElements = document.getElementsByClassName('admin-only'), i;
								for (var i = 0; i < adminElements.length; i ++)
									adminElements[i].style.display = 'block';
							}
						});
						//File upload support
						var fileUploaders = document.getElementsByClassName('inputfile'), i;
						for (var i = 0; i < fileUploaders.length; i ++){
							fileUploaders[i].addEventListener('change', handleFileSelect, false);
						}
					} 
					else {
						// User is signed out.
						document.getElementById('login-button').textContent = '{{ nav.login }}';
						document.getElementById('members').style.display = 'none';

						//Hide all member-only elements
						var memberElements = document.getElementsByClassName('members-only'), i;
						for (var i = 0; i < memberElements.length; i ++)
							memberElements[i].style.display = 'none';
						//Show all non-member elements
						var nonMemberElements = document.getElementsByClassName('non-members'), i;
						for (var i = 0; i < nonMemberElements.length; i ++)
							nonMemberElements[i].style.display = 'block';
						//Disable file uploads
						var fileUploaders = document.getElementsByClassName('inputfile'), i;
						for (var i = 0; i < fileUploaders.length; i ++){
							fileUploaders[i].disabled = true;		
							label = fileUploaders[i].nextElementSibling;
							label.querySelector( 'span' ).innerHTML = "Choose a file&hellip;";
							document.getElementById(fileUploaders[i].id + '-link').innerHTML = '';
						}
						//Hide Admin Elements
						var adminElements = document.getElementsByClassName('admin-only'), i;
						for (var i = 0; i < adminElements.length; i ++)
							adminElements[i].style.display = 'none';
					}
				{% endif %}
			{% endfor %}

			//Shows Member Account Information on the Members Page
			if (window.location.pathname == '/members/' 
				|| window.location.pathname == '/resources/md-leadership-awards-application.html'){
				if (user) {
					firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
						var firstName = snapshot.val().firstName;
						var lastName = snapshot.val().lastName;
						document.getElementById('account-name').textContent = firstName + ' ' + lastName;
						document.getElementById('account-school').textContent = snapshot.val().medicalSchool;
						document.getElementById('account-grad-year').textContent = snapshot.val().graduationYear;
						var accountEmail = document.getElementById('account-email');
						accountEmail.textContent = user.email;
						accountEmail.href = 'mailto:' + user.email;
					});
				} 
				else {
					document.getElementById('account-name').textContent = '';
					document.getElementById('account-school').textContent = '';
					document.getElementById('account-grad-year').textContent = ''
					var accountEmail = document.getElementById('account-email');
					accountEmail.textContent = '';
					accountEmail.href = '';
				}
			}
			

			//Loads previous MD Leadership Award Files if uploaded
			if (user && window.location.pathname == '/resources/md-leadership-awards-application.html'){

				//Have they even saved any files?
				var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}';
				firebase.database().ref(refPath).once('value').then(function(snapshot){
					//If they have, load information.
					if (snapshot.child(user.uid).exists()){
						var application = snapshot.child(user.uid);
						//Loads the submitted application if one exists
						if (application.child('submitted').exists()){
							loadSubmission ();
						}
						//Otherwise displays saved files
						else {
							refPath = refPath + '/' + user.uid;
					    	if (application.child('personalStatement').exists())
					    		loadPrevFile (refPath, 'personal-statement', application.val().personalStatement);
					    	if (application.child('curriculumVitae').exists())
					    		loadPrevFile (refPath, 'curriculum-vitae', application.val().curriculumVitae);
					    	if (application.child('letterGoodStanding').exists())
					    		loadPrevFile (refPath, 'letter-good-standing', application.val().letterGoodStanding);
					    	if (application.child('reference1').exists())
					    		loadPrevFile (refPath, 'reference-1', application.val().reference1);
					    	if (application.child('reference2').exists())
					    		loadPrevFile (refPath, 'reference-2', application.val().reference2);

							var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
							for (var i = 0; i < beforeSubmissionElements.length; i ++)
								beforeSubmissionElements[i].style.display = 'block';
							var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
							for (var i = 0; i < afterSubmissionElements.length; i ++)
								afterSubmissionElements[i].style.display = 'none';
					    }
					}
					else {
						var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
						for (var i = 0; i < beforeSubmissionElements.length; i ++)
							beforeSubmissionElements[i].style.display = 'block';
						var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
						for (var i = 0; i < afterSubmissionElements.length; i ++)
							afterSubmissionElements[i].style.display = 'none';
					}
				});
			}

			//Loads Submitted Applications
			if (user && window.location.pathname == '/resources/md-leadership-awards-view-applications.html'){

				//Confirm that present user is an admin.
				firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
					if(snapshot.val().isAdmin === true){

						//Hide the not-authorized sign.
						document.getElementById('not-authorized').style.display = 'none';

						//Iterates through each submitted application
						var query = firebase.database().ref('leadership-award/' + '{{ site.leadership_award_years }}/').orderByKey();
						//[!- START QUERY]
						query.once("value").then(function(snapshot) {
							var applicationsHTML = '';
							var noApplicants = 0;
							snapshot.forEach(function(childSnapshot) {
								noApplicants ++;

								//If a member has submitted an application
								if (childSnapshot.child('submitted').exists()){
									var submission = childSnapshot;
									applicationsHTML += '<blockquote><div class="flex-wrapper award-application"><div class="left-col"><h4 class="review-header"><strong>Applicant</strong></h4>';
									applicationsHTML += '<label>Name</label><div class="review-text-field">';
									applicationsHTML += submission.val().name + '</div>';
									applicationsHTML += '<label>Medical School</label><div class="review-text-field">';
									applicationsHTML += submission.val().medicalSchool + '</div>';
									applicationsHTML +=	'<label>Graduating Year</label><div class="review-text-field">';
									applicationsHTML += submission.val().graduationYear + '</div>';	
									applicationsHTML +=	'<label>Email Address</label><div class="review-text-field">';
									applicationsHTML += submission.val().emailAddress + '</div>';
									applicationsHTML +=	'<label>CMA Membership ID</label><div class="review-text-field">';
									applicationsHTML += submission.val().cmaMembershipID + '</div>';
									applicationsHTML +=	'<label>Twitter Handle</label><div class="review-text-field">';
									var twitterHandle = submission.val().twitterHandle;
									if (twitterHandle === '')
										applicationsHTML += 'Not given</div>';
									else
										applicationsHTML += '<a href="https://twitter.com/' + twitterHandle.substring(1) + '" target="_blank">' + twitterHandle + '</a></div>';
									applicationsHTML +=	'<label>Attending the CFMS SGM?</label><div class="review-text-field">';
									applicationsHTML += submission.val().meetingAttendance + '</div>';
									applicationsHTML += '</div><div class="right-col"><h4 class="review-header"><strong>Attached Files</strong></h4><ul>';
									applicationsHTML += '<li><a href="' + 'http://google.com' + '" target="_blank">Personal Statement</a></li>';
									applicationsHTML += '<li><a href="' + 'http://google.com' + '" target="_blank">Resume/Curriculum Vitae</a></li>';
									applicationsHTML += '<li><a href="' + 'http://google.com' + '" target="_blank">Proof of Good Standing</a></li>';
									applicationsHTML += '<li><a href="' + 'http://google.com' + '" target="_blank">Reference Letter #1</a></li>';
									applicationsHTML += '<li><a href="' + 'http://google.com' + '" target="_blank">Reference Letter #2</a></li>';
									applicationsHTML += '</ul><h4><strong>Date Submitted</strong></h4>';
									applicationsHTML += '<div class="review-text-field" style="font-weight:normal">' + submission.val().dateSubmitted + '</div>';
									applicationsHTML += '</ul></div></div></blockquote>';
								}
							});
							//Write the HTML for the submissions
							document.getElementById('submitted-applications-list').innerHTML = applicationsHTML;
						});
						//[!- END QUERY]
					}
				});
			}
		});
	}

	window.onload = function() {
		initApp();
	};
</script>