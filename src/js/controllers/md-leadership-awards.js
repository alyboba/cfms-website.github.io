import { FirebaseConnection } from '../repositories/firebase/utils';

class LeadershipAwardUserController extends FirebaseConnection {
    constructor(authenticationService) {
        super();
        this.auth = authenticationService;
        this.process();
    }

    process() {
        //Have they even saved any files?
        var refPath = 'leadership-award/' + window.config.leadership_award_year;
        this.firebase.database().ref(refPath).once('value').then((snapshot) => {
            //If they have, load information.
            if (snapshot.child(this.auth.user.uid).exists()) {
                var application = snapshot.child(this.auth.user.uid);
                //Loads the submitted application if one exists
                if (application.child('submitted').exists()) {
                    loadSubmission();
                }
                //Otherwise displays saved files
                else {
                    refPath = refPath + '/' + this.auth.user.uid;
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
}

class LeadershipAwardAdminController extends FirebaseConnection {
    constructor(authenticationService) {
        super();
        this.auth = authenticationService;
        this.process();
    }

    process() {
        //Confirm that present user is an admin.
        if (!this.auth.user.isAdmin) return console.log("Error: Must be an admin to view this resource.");

        //Iterates through each submitted application
        var query = this.firebase.database().ref('leadership-award/' + window.config.leadership_award_year).orderByKey();
        //[!- START QUERY]
        query.once("value").then((snapshot) => {
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
}
export { LeadershipAwardUserController, LeadershipAwardAdminController };