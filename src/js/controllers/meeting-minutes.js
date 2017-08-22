import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';

export default class MeetingMinutesController extends FirebaseConnection{
	constructor(authenticationService) {
		super();
		this.utils = new Utils();
		this.auth = authenticationService;
		this.process();
	}
	process() {
		if(this.auth.user){
			var elem = '';
			console.log("We are on page with a user signed in!");
			var refPath = 'meeting-minutes/';
			if(this.utils.isPageEnglish()){
				refPath = refPath+'en';
			}
			else{
				refPath = refPath+'fr';
			}
			this.firebase.database().ref(refPath).once('value').then((snapshot) => {
				snapshot.forEach(function (childSnapshot){
					elem += '<p>'+childSnapshot.key+'</p>'
					childSnapshot.forEach(function(subChildSnapshot){
						elem += '<p>'+subChildSnapshot.val().title+'</p>';
						elem += '<p>'+subChildSnapshot.val().subTitle+'</p>';
					});
				});
				
				
				
				document.getElementById('meetingMinutes').innerHTML = elem;
				//console.log(snapshot.val());
			});
			
			
			
		}
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
	}
	
	
}