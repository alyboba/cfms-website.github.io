import FirebaseRepository from './repository';

export default class ExchangePaymentRepository extends FirebaseRepository {
    constructor(Model, UserRepository) {
        super(Model, 'ifmsa_exchanges');
        this.UserRepository = UserRepository;
    }

    get(id) {
        return super.get(id)
            .then(payment => this.UserRepository.get(payment.uid)
                .then(user => {
                    delete payment.uid;
                    payment.user = user;
                    return payment;
                }))
            .catch(err => console.log(`Error: ${err}`));
    }
}