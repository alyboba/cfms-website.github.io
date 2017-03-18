import FirebaseRepository from './repository';

export default class MeetingRegistrationRepository extends FirebaseRepository {
    constructor(Model, UserRepository) {
        super(Model, 'meeting_registrations');
        this.UserRepository = UserRepository;
    }

    get(id) {
        return super.get(id)
            .then(registration => this.UserRepository.get(registration.uid)
                .then(user => {
                    delete registration.uid;
                    registration.user = user;
                    return registration;
                }))
            .catch(err => console.log(`Error: ${err}`));
    }
}