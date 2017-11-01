import MembersContent from '../controllers/members-content';
import AuthenticationService from '../services/authentication';

//Shows Member Account Information on the Members Page
export default function tedmed(ctx, next) {
    new MembersContent(new AuthenticationService());

    next();
}
