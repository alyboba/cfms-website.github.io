import Middleware from '../middlewares';
import Members from './members';
import { LeadershipAwardUser, LeadershipAwardAdmin } from './md-leadership-awards';
import Registration from './registration';
import MeetingRegistrations from './meeting-registrations';
import Purchases from './purchases';
import Exchanges from './exchanges';
import Modal from './modal';
import Pagination from './pagination';
import route from 'page';
import TagSearch from './tag-search';
import PhotoGallery from './photo-gallery';
import MeetingMinutes from './meeting-minutes';
import ForgotPassword from './forgot-password';
import RepResources from './rep-resources';
import Communiques from './communiques';
import ArchivedCommuniques from './communiques-archived';
import Accommodations from './accommodations';
import CarmsInterview from './carms-interview';

export default class Router extends Middleware {
    constructor() {
        super(route);
        this._bindRoutes();
        route.start({ click: false });
    }

    _bindRoutes() {
        route('/members', Members);
        route('/fr/members', Members);
        route('/resources/lasik-membership-card.html', Members);
        route('/fr/resources/lasik-membership-card.html', Members);
        route('/resources/md-leadership-awards-application.html', LeadershipAwardUser);
        route('/resources/md-leadership-awards-view-applications.html', LeadershipAwardAdmin);
        route('/new-account.html', Registration);
        route('/meetings/:meeting', MeetingRegistrations);
        route('/purchases/:purchase', Purchases);
        route('/exchanges/:exchange', Exchanges);
        route('/who-we-are/history.html', Modal);
        route('/who-we-are/organizational-timeline.html', Modal, Pagination);
        route('/fr/who-we-are/history.html', Modal);
        route('/fr/who-we-are/organizational-timeline.html', Modal, Pagination);
        route('/what-we-do/advocacy/position-papers.html', TagSearch);
        route('/fr/what-we-do/advocacy/position-papers.html', TagSearch);
        route('/who-we-are/photo-gallery.html', PhotoGallery);
        route('/fr/who-we-are/photo-gallery.html', PhotoGallery);
        route('/forgot-password.html', ForgotPassword);
        route('/fr/forgot-password.html', ForgotPassword);

        route('/members/meeting-minutes.html', MeetingMinutes);
        route('/fr/members/meeting-minutes.html', MeetingMinutes);
	
        route('/members/communique.html', Communiques);
        route('/fr/members/communique.html', Communiques);
        route('/members/archived-communiques.html', ArchivedCommuniques);
	      route('/fr/members/archived-communiques.html', ArchivedCommuniques);
        
        route('/databases/accommodations.html', Accommodations);
	      route('/fr/databases/accommodations.html', Accommodations);
	      
        route('/databases/carms-interview.html', CarmsInterview);
	      route('/fr/databases/carms-interview.html', CarmsInterview);
      
        route('/resources/rep-resources.html', RepResources);
        route('/fr/resources/rep-resources.html', RepResources);
    }

    refresh() {
        route(window.location.pathname);
    }
}