export default class ViewExchangePayments {
    constructor(authenticationService, exchangePaymentRepository) {
        this.auth = authenticationService;
        this.exchangePaymentRepository = exchangePaymentRepository;
        this.t = null;
        this.process();
    }

    process() {
        if (!this.auth.user || !this.auth.user.isAdmin) return console.log('Access denied.');
        let profile = this.auth.user;

        this.t = $('#example').DataTable();

        this.exchangePaymentRepository.getAll().then(val => {
            let meetingBox = $('#selected-exchange');
            let exchanges = {};
            val.forEach(exchange => {
                exchanges[exchange.key] = exchange;
                meetingBox.append($('<option>', {
                    value: exchange.key,
                    text: exchange.key
                }));
            });
            meetingBox.change(() => {
                const id = meetingBox.val();
                this.t.clear();
                this._populateTable(id, exchanges[id].val())
            });
        });
    }

    _populateTable(id, meeting) {
        for(let exchangeId in meeting) {
            this.exchangePaymentRepository.get(`${id}/${exchangeId}`).then(val => {
                const user = val.user;
                const row = [
                    exchangeId,
                    user.email,
                    user.given_name,
                    user.family_name,
                    val.amount,
                    val.approved
                ];
                this.t.row.add(row).draw(false);
            });
            
        }
    }
}