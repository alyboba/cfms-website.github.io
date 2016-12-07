import PaymentConfirmation from './payment-confirmation';
import Firebase from 'firebase';
import Config from './config';

class App {
    constructor(data) {
        this.firebase = Firebase.initializeApp(Config.firebase());
        this.nav = JSON.parse(data.nav);
        this.lang = data.lang;
        switch (window.location.pathname) {
            case '/members/payments/confirmation.html':
                let urlParams = new URLSearchParams(window.location.search);
                // console.log(urlParams.get('ref1'));
                new PaymentConfirmation(urlParams).process();
                break;
            default:
                console.log('Other');
                this.initApp();
        }
    }

    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    initApp() {
        // Listening for auth state changes.
        this.firebase.auth().onAuthStateChanged((user) => {

            if (accountJustCreated) {
                var firstName = document.getElementById('account-first-name').value;
                var lastName = document.getElementById('account-last-name').value;
                var medicalSchool = document.getElementById('account-medical-school').value;
                var graduationYear = document.getElementById('account-graduation-year').value;
                this.firebase.database().ref('users/' + user.uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    medicalSchool: medicalSchool,
                    graduationYear: graduationYear,
                    isAdmin: false
                })
                accountJustCreated = false;
            }
            this.nav.forEach((navigation) => {
                if (navigation.lang != this.lang) return;

                if (user) {
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
                    this.firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
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

            if (new RegExp('\/members\/payments\/.+').test(window.location.pathname)) {
                if (user) {
                    console.log(user);
                    var event = new CustomEvent('userUpdated', { detail: user });
                    document.dispatchEvent(event);
                }
            }

            //Shows Member Account Information on the Members Page
            if (window.location.pathname == '/members/'
                || window.location.pathname == '/resources/md-leadership-awards-application.html') {
                if (user) {
                    this.firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
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
            if (user && window.location.pathname == '/resources/md-leadership-awards-application.html') {

                //Have they even saved any files?
                var refPath = 'leadership-award/' + '{{ site.leadership_award_years }}';
                this.firebase.database().ref(refPath).once('value').then(function (snapshot) {
                    //If they have, load information.
                    if (snapshot.child(user.uid).exists()) {
                        var application = snapshot.child(user.uid);
                        //Loads the submitted application if one exists
                        if (application.child('submitted').exists()) {
                            loadSubmission();
                        }
                        //Otherwise displays saved files
                        else {
                            refPath = refPath + '/' + user.uid;
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
                this.firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
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
                                noApplicants++;

                                //If a member has submitted an application
                                if (childSnapshot.child('submitted').exists()) {
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