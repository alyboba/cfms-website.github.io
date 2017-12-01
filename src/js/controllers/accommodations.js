import { FirebaseConnection } from '../repositories/firebase/utils';
import Utils from '../utils';

export default class AccommodationsController extends FirebaseConnection {
	constructor(listing, province, authService) {
		super();
		this.utils = new Utils();
		this.auth = authService;
		this.refPath = 'accommodations/';
		this.listing = listing;
		this.province = province;
		this.dbRef;
		this.userName = null;
		this.userId = null;
		this.table;
		this.process();
		
	}
	
	process(){
		if(this.auth.user){
			if(this.utils.isPageEnglish()){ //Set ref path in db to en or fr depending which page...
				this.refPath += 'en/';
			}
			else{
				this.refPath += 'fr/';
			}
			this.createAddButton();
			this.table = $('#accommodationsDatabase').DataTable(); //Initializing Datatables.
			this.dbRef = this.firebase.database().ref(this.refPath).child(`${this.listing}/${this.province}`);
			
			
			
			this.dbRef.on('value', (snapshot) => {
				console.log(snapshot);
				snapshot.forEach((listing) => {
					//A row will be an array of our table data to enter...
					let row = [
						listing.val().city,
						listing.val().rent,
						listing.val().payment,
						listing.val().startDate,
						listing.val().endDate, 
						listing.val().locationAddress,
						listing.val().userName,
						'',
						'',
					];
					this.table.row.add(row).draw(false);
				});
			});
			
			
			
			
			console.log(this.auth.user.identities.user_id); //This will be how to grab uid..
			
			//And this is how to set username.
			console.log(this.auth.user.given_name+' '+this.auth.user.family_name);
			
			
			
		}
		
	}
	
	addDatabaseEntryEvent(evt){
		evt.preventDefault();
		let htmlInput = '<input name="city" type="text" placeholder="City" required/>'+
			'<input name="rent" type="text" placeholder="Rent" required />'+
			'<input name="payment" type="text" placeholder="Payment" required />'+
			'<input name="startDate" type="text"  placeholder="Start Date" required />'+
			'<input name="endDate" type="text"  placeholder="End Date" required />'+
			'<input name="locationAddress" type="text"  placeholder="Location / Address" required />';
		let controller = this;
		
		controller.utils.adminDisplayVexDialog(htmlInput, "Add Entry",data =>{
			
				if(data) {
					let username = controller.auth.user.given_name + ' ' + controller.auth.user.family_name;
					let uid = controller.auth.user.identities[0].user_id;
					controller.dbRef.push({
						city: data.city,
						rent: data.rent,
						payment: data.payment,
						startDate: data.startDate,
						endDate: data.endDate,
						locationAddress: data.locationAddress,
						userName: username,
						uid: uid
					}).then(() => {
						controller.table.clear(); //Re clear the data so it doesn't get written to table 2x...
						controller.utils.displayVexAlert('Successfully Added Entry');
					}).catch((err) => {
						controller.utils.displayVexAlert(err);
					});
				}
		});
	}
	
	
	createAddButton(){
		let temp = document.createElement('div');
		let addButton = this.utils.createButton((this.refPath+this.listing+'/'+this.province), "Add Entry", "addEntry");
		temp.innerHTML = addButton;
		document.getElementById('addButton').appendChild(temp);
		let button = document.getElementsByClassName('addEntry');
		button[0].addEventListener('click', this.addDatabaseEntryEvent.bind(this), false);
	}
	
}