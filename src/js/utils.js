import Vex from 'vex-js';
import VexDialog from 'vex-dialog';
import * as Config from './config';

let instance = null;

export default class Utils {
    constructor() {
        if (instance) return instance;
        Vex.registerPlugin(VexDialog);
        Vex.defaultOptions.className = Config.vex;
        this.vex = Vex;
        instance = this;
    }

    showAlert(title, description) {
        const titleTemplate = `<h3><strong>${title}</strong></h3>`;
        const descriptionTemplate = `<p>${description}</p>`;
        const message = (description) ? titleTemplate + descriptionTemplate : titleTemplate;
        this.vex.dialog.alert({
            unsafeMessage: message
        });
    }

    showSigninModal(cb) {
        const self = this;
        this.vex.dialog.open({
            unsafeMessage: '<h3><strong>Log in to cfms.org</strong></h3>',
            input: "<div class='vex-custom-field-wrapper'><label for='email'>EMAIL ADDRESS</label><div class='vex-custom-input-wrapper'><input name='email' id='login-email' type='email' placeholder='Enter your email' /></div></div><div class='vex-custom-field-wrapper'><label for='password'>PASSWORD</label><div class='vex-custom-input-wrapper'><input id='login-password' name='password' type='password' value='' placeholder='Enter your password'/></div><div id='new-account-link'><a href='/new-account.html'>Create a New Account</a></div><div id='forgot-password'><a href='/forgot-password.html'>Forgot your Password?</a></div></div>",
            beforeClose: function() {
                if (!this.value) return true;
                else if (!this.value.email || !this.value.password) {
                    let form = $(this.form);
                    let emailField = form.find("input[name='email']");
                    let passwordField = form.find("input[name='password']");
                    if (!this.value.email) emailField.addClass("error-field");
                    if (!this.value.password) passwordField.addClass("error-field");
                    return false;
                }
                $("body").append("<div id='loading-overlay' class='loading'>Loading&#8230;</div>");
                cb(this.value.email, this.value.password, profile => {
                    $("#loading-overlay").remove();
                    self.showAlert("Signed in", `Welcome back ${profile.given_name} ${profile.family_name}.`);
                });
                return true;
            }
        });
    }
    isPageEnglish(){
        if(window.location.href.indexOf('/fr/') == -1){
            return true;
        }
        else{
            return false;
        }
    }
    
    //populateModalData(header, body, path){
    //    let modalElem = '';
    //    modalElem += '<div class="modal hidden">';
    //    modalElem += '<div class="modal-content">';
    //    modalElem += '<div class="modal-header">';
    //    modalElem += '<h2>' + header + '</h2>';
    //    modalElem += '</div><hr>';
    //    modalElem += '<div class="modal-body">';
    //    modalElem += '<label>Title:</label>';
    //    modalElem += '<input class="titleSubmission" type="text" placeholder="'+header+'"'+
    //      '/><br>';
    //    modalElem += '<label>Sub-Title:</label>';
    //    modalElem += '<input class="subTitleSubmission" type="text" placeholder="'+body+'"'+
    //      '/><br>';
    //    modalElem += '</div><hr>';
    //    modalElem += '<div class="modal-footer">';
    //    modalElem += '<button value="'+ path +'" class="btn btn-default meetingMinutesUpdateButton">Update</button>';
    //    modalElem += '<button class="btn btn-default modalCloseButton">Close</button>';
    //    modalElem += '<h3><br></h3></div></div></div>';
    //    modalElem += '<div><button class="clickMe">';
    //    modalElem += 'Update</button>';
    //    modalElem += '<button value="'+ path +'" class="deleteEntry">Delete</button></div>';
    //    return modalElem;
    //}
    
    createDeleteButton(path){
        let button = '<button value="'+ path +'" class="deleteEntry">Delete</button>';
        return button;
    }
    createUpdateButton(path){
        let button = '<button value="'+ path +'" class="updateEntry">Update</button>';
        return button;
        
    }
    //createMeetingMinuteYears(startYear, endYear, currentYear){
    //    console.log("hitting this bitch?");
    //    let selectBox = '<select name="year">';
    //    selectBox += '<option value="'+currentYear+'">'+currentYear+'</option>'
    //    for(let i=startYear; i<endYear+1; i++){
    //        selectBox += '<option value="'+i+'">'+i+'</option>'
    //    }
    //    selectBox += '</select>';
    //    
    //    console.log("select box is : "+selectBox);
    //    return selectBox;
    //}
    
}