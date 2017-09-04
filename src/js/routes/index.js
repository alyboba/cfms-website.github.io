import Middleware from '../middlewares';
import Members from './members';
import { LeadershipAwardUser, LeadershipAwardAdmin } from './md-leadership-awards';
import Registration from './registration';
import MeetingRegistrations from './meeting-registrations';
import Purchases from './purchases';
import Modal from './modal';
import Pagination from './pagination';
import route from 'page';
import TagSearch from './tag-search';
import PhotoGallery from './photo-gallery';


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
        route('/meetings/:meeting', MeetingRegistrations);
        route('/purchases/:purchase', Purchases);
        route('/who-we-are/history.html', Modal);
        route('/who-we-are/organizational-timeline.html', Modal, Pagination);
        route('/fr/who-we-are/history.html', Modal);
        route('/fr/who-we-are/organizational-timeline.html', Modal, Pagination);
        route('/what-we-do/advocacy/position-papers.html', TagSearch);
        route('/fr/what-we-do/advocacy/position-papers.html', TagSearch);
        route('/who-we-are/photo-gallery.html', PhotoGallery);
        route('/fr/who-we-are/photo-gallery.html', PhotoGallery);
        
    }

    refresh() {
        route(window.location.pathname);
    }
}