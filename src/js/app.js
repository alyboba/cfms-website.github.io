import Firebase from 'firebase';
import * as Config from './config';
import Router from './router';
import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import Auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';

class App {
    constructor(data) {
        Vex.registerPlugin(VexDialog);
        Vex.defaultOptions.className = Config.vex;
        this.vex = Vex;
        this.firebase = Firebase.initializeApp(Config.firebase);
        this.storageRef = this.firebase.storage().ref();
        this.nav = JSON.parse(data.nav);
        this.lang = data.lang;
        this.router = new Router(this.firebase, this.user, this.uid, data.leadership_award_year);
        this.auth0 = new Auth0.Authentication({
            domain: "cfms.auth0.com",
            clientID: "DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ"
        });
        this.lock = new Auth0Lock('DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ', 'cfms.auth0.com', Config.lock);
        document.getElementById('login-button').addEventListener('click', this.toggleSignIn, false);
        this.initApp();
    }

    get user() {
        return localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null;
    }

    get uid() {
        if (!this.user) return null;
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
        console.log("Initializing application...");
        // listen to when the user gets authenticated and then save the profile
        this.lock.on("authenticated", (authResult) => {
            this.lock.getProfile(authResult.idToken, (error, profile) => {
                if (error) throw error;

                localStorage.setItem('profile', JSON.stringify(profile));

                //get a delegation token
                var options = {
                    id_token: authResult.idToken, // The id_token you have now
                    api: 'firebase', // This defaults to the first active addon if any or you can specify this
                    scope: "openid profile", // default: openid
                    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
                };

                this.auth0.delegation(options, function (err, delegationResult) {
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
        });
    }
};

window.App = App;