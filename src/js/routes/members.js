import MembersController from '../controllers/members';
import AuthenticationService from '../services/authentication';

//Shows Member Account Information on the Members Page
export default function members(ctx, next) {
    new MembersController(new AuthenticationService());

    next();
}
