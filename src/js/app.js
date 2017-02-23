import Firebase from 'firebase';
import * as Config from './config';
import Router from './router';
import Auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import Utils from './utils';
import Api from './api';

class App {
    constructor(data) {
        this.api = new Api();
        this.firebase = Firebase.initializeApp(Config.firebase);
        this.storageRef = this.firebase.storage().ref();
        this.nav = JSON.parse(data.nav);
        this.lang = data.lang;
        this.debug = (data.env == "development");
        this.leadership_award_year = data.leadership_award_year;
        this.auth0 = {};
        this.auth0.authentication = new Auth0.Authentication(Config.auth0);
        this.auth0.webAuth = new Auth0.WebAuth(Config.auth0);
        this.utils = new Utils();
        document.getElementById('login-button').addEventListener('click', this.toggleSignIn.bind(this), false);
        // this.lock = new Auth0Lock('DATrpA9uYr5A8nTH3BHAu3eVOvPoZbuJ', 'cfms.auth0.com', Config.lock);
        // this.lock.on("authenticated", this.handleAuthenticatedUser.bind(this));
        // this.lock.on("hash_parsed", (error) => {
        //     console.log(error);
        // });
        this.router = new Router(this);
        this.handleNav();
    }

    get user() {
        return localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null;
    }

    get uid() {
        if (!this.user) return null;
        let provider = this.user.identities.find((val) => {
            return val.provider === 'auth0' && val.connection === 'cfms-firebase';
        });
        return provider.user_id;
    }

    isAdmin() {
        if (!this.user || !this.user.roles) return null;
        return this.user.roles.some((role) => {
            return role === "admin";
        });
    }

    toggleSignIn(evt) {
        evt.preventDefault();
        if (!localStorage.getItem('profile')) return this.utils.showSigninModal(this.login.bind(this));
        this.firebase.auth().signOut();
        localStorage.removeItem('profile');
        this.auth0.webAuth.logout((this.debug) ? Config.dev_logout : Config.logout);
    }

    login(email, password) {
        this.auth0.authentication.login({
            realm: "cfms-firebase",
            username: email,
            password: password
        }, (err, res) => {
            if (err) return console.log(err);
            console.log(res);
            this.handleAuthenticatedUser(res);
        });
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
                if (this.isAdmin()) {
                    var adminElements = document.getElementsByClassName('admin-only'), i;
                    for (var i = 0; i < adminElements.length; i++)
                        adminElements[i].style.display = 'block';
                }
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

    _delegateFirebase() {
        this.firebase.auth().signInWithCustomToken(this.user.app_metadata.firebase_token).then((user) => {
            console.log(user);
            this.handleNav();
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/invalid-custom-token') {
                console.log('The token you provided is not valid.');
            } else {
                console.error(error);
            }
        });
    }

    handleAuthenticatedUser(authResult) {
        this.auth0.authentication.userInfo(authResult.accessToken, (err, user) => {
            if (err) throw err;
            this.api.getProfile(authResult.accessToken, user.sub, (error, profile) => {
                if (error) throw error; // TODO: handle error
                console.log(profile);

                localStorage.setItem('profile', JSON.stringify(profile));

                this._delegateFirebase();
            });
        });
    }
};

window.App = App;