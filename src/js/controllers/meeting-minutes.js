export default class MeetingMinutesController {
	constructor(authenticationService) {
		this.auth = authenticationService;
		this.process();
	}
	process() {
		if(this.auth.user){
			console.log("We are on page with a user signed in!");
		}
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
	}
	
	
}