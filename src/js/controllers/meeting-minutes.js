export default class MeetingMinutesController {
	constructor(authenticationService) {
		this.auth = authenticationService;
		this.process();
	}
	process() {
		if(this.auth.user){
			console.log("We are on page with a user signed in!");
			//console.log(this.auth.storageRef);
			var path = this.auth.storageRef;
			var file = path.child('CFMS SGM 2013 Minutes.pdf');
			console.log(file);
			file.getMetadata().then(function(metadata){
				console.log(metadata.downloadURLs[0]);
			});
		}
		else{
			console.log("We are on the page with user not signed in tsk tsk tsk.");
		}
	}
	
	
}