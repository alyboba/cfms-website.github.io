import NavigationMiddleware from './navigation';
import AuthenticationMiddleware from './authentication';
import MembersContentMiddleware from './members-content';
import LoginMiddleware from './login';

export default class Middleware {
    constructor(page) {
        page('*', LoginMiddleware); //This has to go before NavigationMiddleware, Nav binds events in Login.
        page('*', NavigationMiddleware);
        
        page('*', AuthenticationMiddleware);
        page('*', MembersContentMiddleware);
    }
}