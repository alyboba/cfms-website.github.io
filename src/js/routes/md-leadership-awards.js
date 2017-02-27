import { LeadershipAwardUserController, LeadershipAwardAdminController } from '../controllers/md-leadership-awards';
import authenticationService from '../services/authentication';

//Loads previous MD Leadership Award Files if uploaded
export function LeadershipAwardUser(ctx, next) {
    new LeadershipAwardUserController(new authenticationService());

    next();
}

//Loads Submitted Applications
export function LeadershipAwardAdmin(ctx, next) {
    new LeadershipAwardAdminController(new authenticationService());

    next();
}