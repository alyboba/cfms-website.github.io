import Firebase from 'firebase';
import Config from './config';
import Router from './router';
import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import Auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';

class App {
    constructor(data) {
        Vex.registerPlugin(VexDialog);
        Vex.defaultOptions.className = Config.vexTheme();
        this.vex = Vex;
        this.firebase = Firebase.initializeApp(Config.firebase());
        this.storageRef = this.firebase.storage().ref();
        this.nav = JSON.parse(data.nav);
        this.lang = data.lang;
        this.router = new Router(this.firebase, this.user, this.uid);
        this.auth0 = new Auth0.Authentication({
            domain: "cfms.auth0.com",
            clientID: "DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ"
        });
        this.lock = new Auth0Lock('DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ', 'cfms.auth0.com', {
            additionalSignUpFields: [{
                name: "code",
                placeholder: "CFMS membership authentication code"
            }]
        });
        document.getElementById('login-button').addEventListener('click', this.toggleSignIn, false);
        this.initApp();
    }

    get user() {
        return localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null;
    }

    get uid() {
        let provider = this.user.identities.find((val) => {
            return val.provider == 'auth0';
        });
        return provider.user_id;
    }

    toggleSignIn(evt) {
        evt.preventDefault();
        if (!localStorage.getItem('profile')) return window.app.lock.show();
        window.app.firebase.auth().signOut();
        localStorage.removeItem('profile');
        this.user = null;
    } 

    handleNav() {
        this.nav.forEach((navigation) => {
            if (navigation.lang != this.lang) return;

            if (this.user) {
                // User is signed in.
                document.getElementById('login-button').textContent = navigation.logout;
                document.getElementById('members').style.display = 'inline';

                //Show all member-only elements
                var memberElements = document.getElementsByClassName('members-only'), i;
                for (var i = 0; i < memberElements.length; i++)
                    memberElements[i].style.display = 'block';
                //Hide all non-member elements
                var nonMemberElements = document.getElementsByClassName('non-members'), i;
                for (var i = 0; i < nonMemberElements.length; i++)
                    nonMemberElements[i].style.display = 'none';
                //Enable file uploads
                var fileUploaders = document.getElementsByClassName('inputfile'), i;
                for (var i = 0; i < fileUploaders.length; i++)
                    fileUploaders[i].disabled = false;
                //Show admin elements if is admin
                this.firebase.database().ref('/users/' + this.uid).once('value').then(function (snapshot) {
                    if (snapshot.val().isAdmin === true) {
                        var adminElements = document.getElementsByClassName('admin-only'), i;
                        for (var i = 0; i < adminElements.length; i++)
                            adminElements[i].style.display = 'block';
                    }
                });
                //File upload support
                var fileUploaders = document.getElementsByClassName('inputfile'), i;
                for (var i = 0; i < fileUploaders.length; i++) {
                    fileUploaders[i].addEventListener('change', handleFileSelect, false);
                }
            }
            else {
                // User is signed out.
                document.getElementById('login-button').textContent = navigation.login;
                document.getElementById('members').style.display = 'none';

                //Hide all member-only elements
                var memberElements = document.getElementsByClassName('members-only'), i;
                for (var i = 0; i < memberElements.length; i++)
                    memberElements[i].style.display = 'none';
                //Show all non-member elements
                var nonMemberElements = document.getElementsByClassName('non-members'), i;
                for (var i = 0; i < nonMemberElements.length; i++)
                    nonMemberElements[i].style.display = 'block';
                //Disable file uploads
                var fileUploaders = document.getElementsByClassName('inputfile'), i;
                for (var i = 0; i < fileUploaders.length; i++) {
                    fileUploaders[i].disabled = true;
                    label = fileUploaders[i].nextElementSibling;
                    label.querySelector('span').innerHTML = "Choose a file&hellip;";
                    document.getElementById(fileUploaders[i].id + '-link').innerHTML = '';
                }
                //Hide Admin Elements
                var adminElements = document.getElementsByClassName('admin-only'), i;
                for (var i = 0; i < adminElements.length; i++)
                    adminElements[i].style.display = 'none';
            }
        });
    }

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    initApp() {
        // listen to when the user gets authenticated and then save the profile
        this.lock.on("authenticated", (authResult) => {
            this.lock.getProfile(authResult.idToken, (error, profile) => {

                if (error) {
                    // handle error
                    return;
                }

                localStorage.setItem('profile', JSON.stringify(profile));
                this.user = profile;

                //get a delegation token
                var options = {
                    id_token: authResult.idToken, // The id_token you have now
                    api: 'firebase', // This defaults to the first active addon if any or you can specify this
                    scope: "openid profile", // default: openid
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
                };

                this.auth0.delegation(options, function (err, delegationResult) {
                    console.log(err);
                    console.log(delegationResult);
                    if (err) return console.log(err);
                    // Exchange the delegate token for a Firebase auth token
                    window.app.firebase.auth().signInWithCustomToken(delegationResult.idToken).catch((error) => {
                        console.log(error);
                    });
                });
            });
        });
        // Listening for auth state changes.
        this.firebase.auth().onAuthStateChanged((user) => {

            // if (accountJustCreated) {
            //     var firstName = document.getElementById('account-first-name').value;
            //     var lastName = document.getElementById('account-last-name').value;
            //     var medicalSchool = document.getElementById('account-medical-school').value;
            //     var graduationYear = document.getElementById('account-graduation-year').value;
            //     this.firebase.database().ref('users/' + uid).set({
            //         firstName: firstName,
            //         lastName: lastName,
            //         medicalSchool: medicalSchool,
            //         graduationYear: graduationYear,
            //         isAdmin: false
            //     })
            //     accountJustCreated = false;
            // }

            this.handleNav();


            //Loads previous MD Leadership Award Files if uploaded
            if (user && window.location.pathname == '/resources/md-leadership-awards-application.html') {

                //Have they even saved any files?
                var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}';
                this.firebase.database().ref(refPath).once('value').then(function (snapshot) {
                    //If they have, load information.
                    if (snapshot.child(uid).exists()) {
                        var application = snapshot.child(uid);
                        //Loads the submitted application if one exists
                        if (application.child('submitted').exists()) {
                            loadSubmission();
                        }
                        //Otherwise displays saved files
                        else {
                            refPath = refPath + '/' + this.uid;
                            if (application.child('personalStatement').exists())
                                loadPrevFile(refPath, 'personal-statement', application.val().personalStatement);
                            if (application.child('curriculumVitae').exists())
                                loadPrevFile(refPath, 'curriculum-vitae', application.val().curriculumVitae);
                            if (application.child('letterGoodStanding').exists())
                                loadPrevFile(refPath, 'letter-good-standing', application.val().letterGoodStanding);
                            if (application.child('reference1').exists())
                                loadPrevFile(refPath, 'reference-1', application.val().reference1);
                            if (application.child('reference2').exists())
                                loadPrevFile(refPath, 'reference-2', application.val().reference2);

                            var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
                            for (var i = 0; i < beforeSubmissionElements.length; i++)
                                beforeSubmissionElements[i].style.display = 'block';
                            var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
                            for (var i = 0; i < afterSubmissionElements.length; i++)
                                afterSubmissionElements[i].style.display = 'none';
                        }
                    }
                    else {
                        var beforeSubmissionElements = document.getElementsByClassName('before-submission'), i;
                        for (var i = 0; i < beforeSubmissionElements.length; i++)
                            beforeSubmissionElements[i].style.display = 'block';
                        var afterSubmissionElements = document.getElementsByClassName('after-submission'), i;
                        for (var i = 0; i < afterSubmissionElements.length; i++)
                            afterSubmissionElements[i].style.display = 'none';
                    }
                });
            }

            //Loads Submitted Applications
            if (user && window.location.pathname == '/resources/md-leadership-awards-view-applications.html') {

                //Confirm that present user is an admin.
                this.firebase.database().ref('/users/' + this.uid).once('value').then(function (snapshot) {
                    if (snapshot.val().isAdmin === true) {

                        //Hide the not-authorized sign.
                        document.getElementById('not-authorized').style.display = 'none';

                        //Iterates through each submitted application
                        var query = this.firebase.database().ref('leadership-award/' + '{{ site.leadership_award_years }}/').orderByKey();
                        //[!- START QUERY]
                        query.once("value").then(function (snapshot) {
                            var applicationsHTML = '';
                            var noApplicants = 0;
                            snapshot.forEach(function (childSnapshot) {

                                //If a member has submitted an application
                                if (childSnapshot.child('submitted').exists()) {
                                    noApplicants++;
                                    var submission = childSnapshot;
                                    applicationsHTML += '<blockquote><div class="flex-wrapper award-application"><div class="left-col"><h4 class="review-header"><strong>Applicant</strong></h4>';
                                    applicationsHTML += '<label>Name</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().name + '</div>';
                                    applicationsHTML += '<label>Medical School</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().medicalSchool + '</div>';
                                    applicationsHTML += '<label>Graduating Year</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().graduationYear + '</div>';
                                    applicationsHTML += '<label>Email Address</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().emailAddress + '</div>';
                                    applicationsHTML += '<label>CMA Membership ID</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().cmaMembershipID + '</div>';
                                    applicationsHTML += '<label>Twitter Handle</label><div class="review-text-field">';
                                    var twitterHandle = submission.val().twitterHandle;
                                    if (twitterHandle === '')
                                        applicationsHTML += 'Not given</div>';
                                    else
                                        applicationsHTML += '<a href="https://twitter.com/' + twitterHandle.substring(1) + '" target="_blank">' + twitterHandle + '</a></div>';
                                    applicationsHTML += '<label>Attending the CFMS SGM?</label><div class="review-text-field">';
                                    applicationsHTML += submission.val().meetingAttendance + '</div>';
                                    applicationsHTML += '</div><div class="right-col"><h4 class="review-header"><strong>Attached Files</strong></h4><ul>';
                                    applicationsHTML += '<li><a href="' + submission.val().linkPersonalStatement + '" target="_blank">Personal Statement</a></li>';
                                    applicationsHTML += '<li><a href="' + submission.val().linkCurriculumVitae + '" target="_blank">Resume/Curriculum Vitae</a></li>';
                                    applicationsHTML += '<li><a href="' + submission.val().linkLetterGoodStanding + '" target="_blank">Proof of Good Standing</a></li>';
                                    applicationsHTML += '<li><a href="' + submission.val().linkReference1 + '" target="_blank">Reference Letter #1</a></li>';
                                    applicationsHTML += '<li><a href="' + submission.val().linkReference2 + '" target="_blank">Reference Letter #2</a></li>';
                                    applicationsHTML += '</ul><h4><strong>Date Submitted</strong></h4>';
                                    applicationsHTML += '<div class="review-text-field" style="font-weight:normal">' + submission.val().dateSubmitted + '</div>';
                                    applicationsHTML += '</ul></div></div></blockquote>';
                                }
                            });
                            //Write the HTML for the submissions
                            if (noApplicants !== 0)
                                document.getElementById('submitted-applications-list').innerHTML = applicationsHTML;
                            else
                                document.getElementById('submitted-applications-list').innerHTML = '<blockquote><h3><strong>No Submitted Applications Yet</strong></h3><ul><li>It\'s only a matter of time!</li></ul></blockquote>'
                        });
                        //[!- END QUERY]
                    }
                });
            }
        });


    }
};

window.App = App;