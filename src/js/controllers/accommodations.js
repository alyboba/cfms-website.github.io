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
			let refPath = this.refPath+this.listing+'/'+this.province;
			this.table = $('#accommodationsDatabase').DataTable(); //Initializing Datatables.
			this.dbRef = this.firebase.database().ref(this.refPath).child(`${this.listing}/${this.province}`);
			
			this.dbRef.on('value', (snapshot) => {
				//Since this is an observable, clear table each time it is invoked to avoid overlapping data.....
				this.table.clear();
				snapshot.forEach((listing) => {
					//console.log(listing.key);
					let delTemp = ''
					if(this.auth.isAdmin || listing.val().uid == this.auth.user.identities[0].user_id) {
						//console.log("This getting called?");
						let delButton = this.utils.createButton(refPath +'/'+ listing.key, "Del", 'delEntry');
						delTemp = delButton;
						//Need to still make 1 for edit buttons...
					}
					
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
						delTemp,
					];
					this.table.row.add(row).draw(false);
				});
				//This needs to be inside the observable so isn't called off race condition..
				let delButtons = document.getElementsByClassName('delEntry');
				for(let i=0; i<delButtons.length; i++){
					delButtons[i].addEventListener('click', this.deleteDatabaseEntryEvent.bind(this), false);
				}				
			});
			
		}
	}
	
	deleteDatabaseEntryEvent(evt){
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		this.utils.vexConfirm().then( () => {
			this.delEntry(dbPath);
		});
	}
	
	delEntry(dbPath){
		this.firebase.database().ref(dbPath).remove()
			.then(() => {
				this.utils.displayVexAlert("Successfully Deleted Entry");
			}).catch((err) => {
				this.utils.displayVexAlert(err);
		});
	}
	
	addDatabaseEntryEvent(evt){
		evt.preventDefault();
		let htmlInput =	'<input name="city" type="text" placeholder="City" required minlength="2" maxlength="15" data-validation-error-msg="Please Enter Value between 2-15 characters"/>'+
			'<input name="rent" type="text" placeholder="Rent" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />'+
			'<input name="payment" type="text" placeholder="Payment" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />'+
			'<input class="validate" name="startDate" required pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD" type="text"  placeholder="Start Date"/>'+
			'<input name="endDate" type="text" required pattern ="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD"  placeholder="End Date" />'+
			'<input name="locationAddress" required minlength="10" maxlength="180" type="text"  placeholder="Location / Address" />'+
		
			"<script>" +
			"$.validate({" +
			"modules: 'html5'});" +
			"</script>";
		
		
		let controller = this;
		
		controller.utils.adminDisplayVexDialog(htmlInput, "Add Entry",data =>{
				if(data) {
					data.city = controller.utils.sanatizeInput(data.city);
					data.rent = controller.utils.sanatizeInput(data.rent);
					data.payment = controller.utils.sanatizeInput(data.payment);
					data.startDate = controller.utils.sanatizeInput(data.startDate);
					data.endDate = controller.utils.sanatizeInput(data.endDate);
					data.locationAddress = controller.utils.sanatizeInput(data.locationAddress);
					
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







