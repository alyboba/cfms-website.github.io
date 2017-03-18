import Model from './model';
import UserModel from './user';

export default class MeetingRegistrationModel extends Model {
    constructor(registration) {
        super();
        Object.assign(this, registration);
    }

    static fromRow(row) {
        return new MeetingRegistrationModel(row);
    }

    static fromRows(rows) {
        return rows.map(row => new MeetingRegistrationModel(row));
    }
}