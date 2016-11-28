<script type="text/javascript">
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
				console.log(error);
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
			console.log(error);
		});
		vex.dialog.alert('<h3><strong>Account Successfully Created</strong></h3><p>Your account has successfully been created! You are now logged in. Welcome to the CFMS!</p>')
	}

	function addExtraFields() {
		//Adds Extra Fields
		var user = firebase.auth().currentUser;
		var firstName = document.getElementById('account-first-name').value;
		var lastName = document.getElementById('account-last-name').value;
		var medicalSchool = document.getElementById('account-medical-school').value;
		var graduationYear = document.getElementById('account-graduation-year').value;
		firebase.database().ref('users/' + user.uid).set({
		    firstName: firstName,
		    lastName: lastName,
		    medicalSchool: medicalSchool,
		    graduationYear: graduationYear
		})
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
			console.log(error);
		});
	}

	/**
	 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
	 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
	 *    out, and that is where we update the UI.
	 */
	function initApp() {
		// Listening for auth state changes.
		firebase.auth().onAuthStateChanged(function(user) {
			{% for nav in site.data.translations.nav %}
				{% if nav.lang == page.lang %}
					if (user) {
						// User is signed in.
						var displayName = user.displayName;
						var email = user.email;
						var emailVerified = user.emailVerified;
						var photoURL = user.photoURL;
						var isAnonymous = user.isAnonymous;
						var uid = user.uid;
						var providerData = user.providerData;

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
					}
				{% endif %}
			{% endfor %}
		});
	}

	window.onload = function() {
		initApp();
	};
</script>