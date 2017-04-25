import FirebaseRepository from './repository';

export default class MeetingRepository extends FirebaseRepository {
    constructor(Model, UserRepository) {
        super(Model, 'meeting');
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