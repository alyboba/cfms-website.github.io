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
            let exchangeBox = $('#selected-exchange');
            let exchanges = {};
            val.forEach(exchange => {
                exchanges[exchange.key] = exchange;
                exchangeBox.append($('<option>', {
                    value: exchange.key,
                    text: exchange.key
                }));
            });
            exchangeBox.change(() => {
                const id = exchangeBox.val();
                this.t.clear();
                this._populateTable(id, exchanges[id].val())
            });
        });
    }

    _populateTable(id, exchange) {
        console.log(exchange);
        for(let exchangeId in exchange) {
            this.exchangePaymentRepository.get(`${id}/${exchangeId}`).then(val => {
                const row = [
                    exchangeId,
                    val.custom.email,
                    val.custom.name,
                    val.amount,
                    (val.approved === '1') ? 'Yes' : 'No'
                ];
                this.t.row.add(row).draw(false);
            });
            
        }
    }
}