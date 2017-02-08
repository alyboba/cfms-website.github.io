export const firebase = {
    apiKey: "AIzaSyCRaJStQDuZ0nrn0b59kzYphlAkJ62flo8",
    authDomain: "amber-heat-9132.firebaseapp.com",
    databaseURL: "https://amber-heat-9132.firebaseio.com",
    storageBucket: "amber-heat-9132.appspot.com",
    messagingSenderId: "466232039218"
};

export const vex = 'vex-theme-default';

export const lock = {
    auth: {
        redirectUrl: 'http://localhost:4000/members',
        responseType: 'token'
    },
    theme: {
        logo: '/images/cfms-logo.svg'
    },
    languageDictionary: {
        title: 'CFMS'
    },
    allowSignUp: false,
    additionalSignUpFields: [{
        name: "code",
        placeholder: "CFMS membership authentication code"
    }]
};