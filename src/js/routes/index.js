import Middleware from '../middlewares';
import Members from './members';
import { LeadershipAwardUser, LeadershipAwardAdmin } from './md-leadership-awards';
import Registration from './registration';
import MeetingRegistrations from './meeting-registrations';
import route from 'page';

export default class Router extends Middleware {
    constructor() {
        super(route);
        this._bindRoutes();
        route.start({ click: false });
    }

    _bindRoutes() {
        route('/members', Members);
        route('/fr/members', Members);
        route('/resources/md-leadership-awards-application.html', LeadershipAwardUser);
        route('/resources/md-leadership-awards-view-applications.html', LeadershipAwardAdmin);
        route('/new-account.html', Registration);
        route('/meetings/view-registrations.html', MeetingRegistrations);
    }

    refresh() {
        route(window.location.pathname);
    }
}