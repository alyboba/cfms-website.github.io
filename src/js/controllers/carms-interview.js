import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';
import {schools, specialties, list } from './dependencies/databases/interview-school-specialties';


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
		this.list = list;
		this.table;
		this.process();
	}
	process(){
		if(this.auth.user){
			console.log(this.schools);
			console.log(this.specialties);
			console.log(this.list);
			this.createList(this.schools, 'schools');
			this.createList(this.specialties, 'specialties');
			
			$('#schools-list').change((evt) => {
				let value = evt.target.value;
				let specialties = this.list.filter((list) => list.school === value).map((list) => list.specialties);
				if(specialties.length > 0){
					this.createList(specialties, 'specialties');
				}
				else{
					this.createList(this.specialties, 'specialties');
				}
				
				console.log(specialties);
				
			});
			
			
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