import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';
import {schools, specialties, schoolData, specialtyData } from './dependencies/databases/interview-school-specialties';


export default class CarmsInterviewController extends FirebaseConnection {
	constructor(authService) {
		super();
		this.utils = new Utils();
		this.auth = authService;
		this.refPath = 'interviews/';
		this.dbRef;
		this.specialty = null;
		this.school = null;
		this.userName = null;
		this.userId = null;
		this.schools = schools;
		this.specialties = specialties;
		this.schoolSpecialtyHash = schoolData;
		this.specialtySchoolHash = specialtyData;
		this.table;
		this.process();
	}
	process(){
		if(this.auth.user){
			//Initially populate our lists with the schools and list from data pulled in.
			this.createList(this.schools, 'schools');
			this.createList(this.specialties, 'specialties');
			
			//Handle when user changes schools list
			$('#schools-list').change((evt) => {
				let value = evt.target.value;
				let specialties = this.schoolSpecialtyHash.filter((list) => list.school === value).map((list) => list.specialties);
				this.handleListChange('specialties', specialties, this.specialties);
			});
			
			//Handle when user changes specialties list.
			$('#specialties-list').change((evt) => {
				let value = evt.target.value;
				let schools = this.specialtySchoolHash.filter((list) => list.specialty === value).map((list) => list.schools);
				this.handleListChange('schools', schools, this.schools);
			});
		}
	}
	
	handleListChange(id, array, list){
		if(array.length > 0){
			this.createList(array[0], id);
		}
		else{
			this.createList(list, id);
		}
	}
	
	createList(array, id){
		let listEditing = document.getElementById(id);
		let list = array.reduce((previous, current) => {
			return previous + '<option value="'+current+'">'+current+'</option>';
		}, '');
		listEditing.innerHTML = list;
	}
}