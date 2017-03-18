import Middleware from '../middlewares';
import Members from './members';
import { LeadershipAwardUser, LeadershipAwardAdmin } from './md-leadership-awards';
import Registration from './registration';
import page from 'page';

export default class Router extends Middleware {
    constructor() {
        super(page);
        this._bindRoutes();
        page.start({ click: false });
    }

    _bindRoutes() {
        page('/members', Members);
        page('/fr/members',Members);
        page('/resources/md-leadership-awards-application.html', LeadershipAwardUser);
        page('/resources/md-leadership-awards-view-applications.html', LeadershipAwardAdmin);
        page('/new-account.html', Registration);
    }

    refresh() {
        page(window.location.pathname);
    }
}