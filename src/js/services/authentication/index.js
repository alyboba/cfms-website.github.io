import Auth0Provider from './providers/auth0';
import FirebaseProvider from './providers/firebase';
import UserModel from '../../models/user';
import Utils from '../../utils';
import UserRepository from '../../repositories/api/user';
import _ from 'lodash';

let instance = null;

export default class AuthenticationService {
    constructor() {
        if (instance) return instance;
        this.auth0 = new Auth0Provider();
        this.firebase = new FirebaseProvider();
        this.utils = new Utils();
        this.UserRepository = new UserRepository(UserModel);
        this.dispatchUser();
        instance = this;
    }
 
    login(email, password, cb) {
        this.auth0.getAccessToken(email, password, (err, accessToken, uid) => {
            if (err) return console.log(err);
            this.UserRepository.get(uid)
                .then(user => {
                    localStorage.setItem('profile', JSON.stringify(user.toSparseRow()));
                    this.dispatchUser();
                    this.firebase.authenticate(user.app_metadata.firebase_token, err => {
                        if (err) return console.log(err);
                        if (cb && _.isFunction(cb)) cb(this.user);
                    });
                })
                .catch(err => console.log(err));
        });
    }

    logout() {
        this.firebase.logout();
        localStorage.removeItem('profile');
        this.auth0.logout();
    }

    get user() {
        let user = localStorage.getItem('profile');
        return (user) ? new UserModel(user) : null;
    }

    get accessToken() {
        let accessToken = localStorage.getItem('accessToken');
        return (accessToken) ? accessToken : null;
    }

    dispatchUser() {
        window.dispatchEvent(new CustomEvent('user_updated', { detail: this.user }));
    }

    register(user) {
        this.auth0.register(user, (err) => {
            if (err) {
                let desc = err.description || "Please check your authentication code.";
                return this.utils.showAlert("Something went wrong", desc);
            }
            this.login(user.email, user.password, () => {
                this.utils.showAlert("Account Successfully Created", "Your account has successfully been created! Click OK to be logged in and redirected to the members area. Welcome to the CFMS!");
                document.getElementsByClassName('vex-dialog-button-primary')[0].addEventListener('click', (evt) => {
                    window.location.pathname = '/members';
                });
            });
        });
    }
}