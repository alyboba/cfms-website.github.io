import Model from './model';
import UserModel from './user';

export default class ExchangePaymentModel extends Model {
    constructor(payment) {
        super();
        Object.assign(this, payment);
    }

    static fromRow(row) {
        return new ExchangePaymentModel(row);
    }

    static fromRows(rows) {
        return rows.map(row => new ExchangePaymentModel(row));
    }
}