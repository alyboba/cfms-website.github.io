import NavigationMiddleware from './navigation';
import AuthenticationMiddleware from './authentication';

export default class Middleware {
    constructor(page) {
        page('*', NavigationMiddleware);
        page('*', AuthenticationMiddleware);
    }
}