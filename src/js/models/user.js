import Model from './model';

export default class UserModel extends Model {
    constructor(profile) {
        super();
        Object.assign(this, JSON.parse(profile));
    }

    static fromRow(row) {
        return new UserModel(row);
    }

    static fromRows(rows) {
        return rows.map(row => new UserModel(row));
    }

    get uid() {
        if (!this.user_id) return null;
        let provider = this.identities.find((val) => {
            return val.provider === 'auth0' && val.connection === 'cfms-firebase';
        });
        return provider.user_id;
    }

    get isAdmin() {
        if (!this.app_metadata || !this.app_metadata.roles) return false;
        return this.app_metadata.roles.some((role) => {
            return role === "admin";
        });
    }
}