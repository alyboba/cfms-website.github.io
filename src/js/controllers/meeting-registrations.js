export default class MeetingRegistrationsController {
    constructor(authenticationService, meetingRegistrationRepository) {
        this.auth = authenticationService;
        this.meetingRegistrationRepository = meetingRegistrationRepository;
        this.process();
    }

    process() {
        if (this.auth.user) {
            let profile = this.auth.user;
            var firstName = profile.given_name;
            var lastName = profile.family_name;
            this.meetingRegistrationRepository.get("/DEMO/-Kf2ZSXYkqlWeAGpPjyN").then(val => console.log(val));
        }
        else {

        }
    }
}