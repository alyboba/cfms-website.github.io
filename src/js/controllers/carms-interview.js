import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';
import {schools, specialties, schoolData, specialtyData} from './dependencies/databases/interview-school-specialties';


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
	
	process() {
		if (this.auth.user) {
			//Initially populate our lists with the schools and list from data pulled in.
			this.createList(this.schools, 'schools-list', 'School');
			this.createList(this.specialties, 'specialties-list', 'Specialty');
			
			
			//Handle when user changes schools list
			$('#schools-list').change((evt) => {
				let specialtyValue = $('#specialties-list').find(":selected").val();
				console.log(specialtyValue);
				let value = evt.target.value;
				if (value == "notSelected") {
					this.createList(this.specialties, 'specialties-list', 'Specialty');
				}
				else {
					let specialties = this.schoolSpecialtyHash.filter((list) => list.school === value).map((list) => list.specialties);
					this.handleListChange('specialties-list', specialties, this.specialties, 'Specialty');
				}
				$('#specialties-list').val(specialtyValue);
			});
			
			//Handle when user changes specialties list.
			$('#specialties-list').change((evt) => {
				let schoolValue = $('#schools-list').find(":selected").val();
				console.log(schoolValue);
				let value = evt.target.value;
				if(value == "notSelected"){
					this.createList(this.schools, 'schools-list', 'School');
				}
				else {
					let schools = this.specialtySchoolHash.filter((list) => list.specialty === value).map((list) => list.schools);
					this.handleListChange('schools-list', schools, this.schools, 'School');
				}
				$('#schools-list').val(schoolValue);
			});
		}
	}
	
	handleListChange(id, array, list, name) {
		if (array.length > 0) {
			this.createList(array[0], id, name);
		}
		else {
			this.createList(list, id, name);
		}
	}
	
	createList(array, id, name) {
		let listEditing = document.getElementById(id);
		let list = array.reduce((previous, current) => {
			return previous + '<option value="' + current + '">' + current + '</option>';
		}, '<option selected value="notSelected"> -- Select a ' + name + ' -- </option>');
		listEditing.innerHTML = list;
	}
}