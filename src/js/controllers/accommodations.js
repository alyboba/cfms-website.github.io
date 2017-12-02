import {FirebaseConnection} from '../repositories/firebase/utils';
import Utils from '../utils';

export default class AccommodationsController extends FirebaseConnection {
	constructor(authService) {
		super();
		this.utils = new Utils();
		this.auth = authService;
		this.refPath = 'accommodations/';
		//this.listing = listing;
		//this.province = province;
		this.dbRef;
		this.listing = null;
		this.province = null;
		this.userName = null;
		this.userId = null;
		this.table;
		this.process();
		
	}
	
	process() {
		if (this.auth.user) {
			if (this.utils.isPageEnglish()) { //Set ref path in db to en or fr depending which page...
				this.refPath += 'en/';
			}
			else {
				this.refPath += 'fr/';
			}
			this.table = $('#accommodationsDatabase').DataTable({
				"columnDefs": [
					{ className: "details-control", "targets": [0]}
				]
			}); //Initializing Datatables.
			
			$('#select-listing').change(() => {
				this.listing = $('#select-listing').find(":selected").val();
				this.populateTable();
			});
			$('#select-province').change(() => {
				this.province = $('#select-province').find(":selected").val();
				this.populateTable();
			});
		}
		
	}
	
	
	populateTable() {
		//console.log()
		if (this.listing && this.province) { //Make sure user has selected both select options..
			this.table.clear().draw();
			this.createAddButton();
			let refPath = this.refPath + this.listing + '/' + this.province;
			this.dbRef = this.firebase.database().ref(this.refPath).child(`${this.listing}/${this.province}`); //Reset reference.
			this.dbRef.on('value', (snapshot) => {
				//Since this is an observable, clear table each time it is invoked to avoid overlapping data.....
				this.table.clear(); //Needs to be here for updating data.
				
				if (snapshot.hasChildren()) {
					snapshot.forEach((listing) => {
						//console.log(listing.key);
						let delTemp = '';
						let editTemp ='';
						if (this.auth.isAdmin || listing.val().uid == this.auth.user.identities[0].user_id) {
							let editButton = this.utils.createWithIdButton(refPath+'/'+listing.key, 'Edit', listing.key, 'editEntry');
							editTemp = editButton;
							//console.log("This getting called?");
							let delButton = this.utils.createButton(refPath + '/' + listing.key, "Del", 'delEntry');
							delTemp = delButton;
							//Need to still make 1 for edit buttons...
						}
						//let tmp = '<div class="details-control"></div>';
						//A row will be an array of our table data to enter...
						let row = [ 
							'',
							listing.val().city,
							listing.val().rent,
							listing.val().payment,
							listing.val().startDate,
							listing.val().endDate,
							editTemp,
							delTemp
						];
						let data = [
							listing.val().locationAddress,
							listing.val().userName,
						];
						this.table.row.add(row).child(this.formatExpand(data)).draw(false);
					});
					let expandButtons = document.getElementsByClassName('details-control');
					for(let i=0; i<expandButtons.length; i++){
						expandButtons[i].addEventListener('click', this.expandEvent.bind(this), false);
					}
					//This needs to be inside the observable so isn't called off race condition..
					let delButtons = document.getElementsByClassName('delEntry');
					for (let i = 0; i < delButtons.length; i++) {
						delButtons[i].addEventListener('click', this.deleteDatabaseEntryEvent.bind(this), false);
					}
					let editButtons = document.getElementsByClassName('editEntry');
					console.log(editButtons);
					for (let i = 0; i < editButtons.length; i++) {
						editButtons[i].addEventListener('click', this.editDatabaseEntry.bind(this), false);
					}
				}
				else {
					this.table.clear().draw(); //NO data available, so clear it all out and redraw it..
				}
			});
		}
		else {
			this.table.clear();
		}
	}
	
	editDatabaseEntry(evt){
		let key = evt.target.getAttribute('id');
		let controller = this;
		this.dbRef.child(key).once('value').then( (snapshot) => {
			let obj = {};
			console.log(snapshot.val().city);
			obj['city'] = snapshot.val().city;
			obj['rent'] = snapshot.val().rent;
			obj['payment'] = snapshot.val().payment;
			obj['startDate'] = snapshot.val().startDate;
			obj['endDate'] = snapshot.val().endDate;
			obj['locationAddress'] = snapshot.val().locationAddress;
			let htmlInput = this.setHtmlInput(obj);
			console.log(obj.city);
			console.log(htmlInput);
			
		  this.utils.adminDisplayVexDialog(htmlInput, "Edit Entry", data => {
		  	if(data){
				  for(const prop in data){
					  data[prop] = controller.utils.sanatizeInput(data[prop]);
				  }
				  let username = controller.auth.user.given_name + ' ' + controller.auth.user.family_name;
				  let uid = controller.auth.user.identities[0].user_id;
				  
				  this.dbRef.child(key).update({
					  city: data.city,
					  rent: data.rent,
					  payment: data.payment,
					  startDate: data.startDate,
					  endDate: data.endDate,
					  locationAddress: data.locationAddress,
					  userName: username,
					  uid: uid
				  });
			  }
		  }).then(() => {
			  controller.utils.displayVexAlert('Successfully Updated Entry');
		  }).catch((err) => {
			  controller.utils.displayVexAlert(err);
		  });
		}).catch((err) => {
			console.log(err);
		});
	}
	
	
	expandEvent(evt){
		console.log(this);
		console.log(evt);
		let tr = $(evt.target).closest('tr');
		let row = this.table.row(tr);
		if(row.child.isShown()){
			row.child.hide();
			tr.removeClass('shown');
		}
		else{
			row.child.show();
			tr.addClass('shown');
		}
	}
	
	
	formatExpand(infoArray) {
		return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
			'<tr>' +
			'<td>Location / Address:</td>' +
			'<td>' + infoArray[0] + '</td>' +
			'</tr>' +
			'<tr>' +
			'<td>Full Name:</td>' +
			'<td>' + infoArray[1] + '</td>' +
			'</tr>' +
			'</table>';
		
	}
	
	
	deleteDatabaseEntryEvent(evt) {
		evt.preventDefault();
		let dbPath = evt.target.getAttribute('src');
		this.utils.vexConfirm().then(() => {
			this.delEntry(dbPath);
		});
	}
	
	delEntry(dbPath) {
		this.firebase.database().ref(dbPath).remove()
			.then(() => {
				this.utils.displayVexAlert("Successfully Deleted Entry");
			}).catch((err) => {
			this.utils.displayVexAlert(err);
		});
	}
	
	
	setHtmlInput(data){
		let cityVal = data ? data.city : '';
		let rentVal = data ? data.rent : '';
		let paymentVal = data ? data.payment : '';
		let startDateVal = data ? data.startDate : '';
		let endDateVal = data ? data.endDate : '';
		let locationAddressVal = data ? data.locationAddress : '';
		return '<input name="city" value="'+cityVal+'" type="text" placeholder="City" required minlength="2" maxlength="15" data-validation-error-msg="Please Enter Value between 2-15 characters"/>' +
			'<input name="rent" value="'+rentVal+'" type="text" placeholder="Rent" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />' +
			'<input name="payment" value="'+paymentVal + '" type="text" placeholder="Payment" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />' +
			'<input class="validate" value="'+startDateVal+'" name="startDate" required pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD" type="text"  placeholder="Start Date"/>' +
			'<input name="endDate" value="'+endDateVal+'" type="text" required pattern ="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD"  placeholder="End Date" />' +
			'<textarea name="locationAddress" required minlength="10" maxlength="180" type="text"  placeholder="Location / Address" >'+locationAddressVal+
			'</textarea>' +
			
			"<script>" +
			"$.validate({" +
			"modules: 'html5'});" +
			"</script>";
	}
	
	addDatabaseEntryEvent(evt) {
		evt.preventDefault();
		let htmlInput = this.setHtmlInput(null);
		
		// let htmlInput = '<input name="city" type="text" placeholder="City" required minlength="2" maxlength="15" data-validation-error-msg="Please Enter Value between 2-15 characters"/>' +
		// 	'<input name="rent" type="text" placeholder="Rent" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />' +
		// 	'<input name="payment" type="text" placeholder="Payment" required minlength="2" maxlength="10" data-validation-error-msg="Please Enter Value between 2-10 characters" />' +
		// 	'<input class="validate" name="startDate" required pattern="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD" type="text"  placeholder="Start Date"/>' +
		// 	'<input name="endDate" type="text" required pattern ="[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])" data-validation-help="YYYY-MM-DD"  placeholder="End Date" />' +
		// 	'<textarea name="locationAddress" required minlength="10" maxlength="180" type="text"  placeholder="Location / Address" ></textarea>' +
		//	
		// 	"<script>" +
		// 	"$.validate({" +
		// 	"modules: 'html5'});" +
		// 	"</script>";
		
		
		let controller = this;
		
		controller.utils.adminDisplayVexDialog(htmlInput, "Add Entry", data => {
			if (data) {
				console.log(data);
				for(const prop in data){ 
					data[prop] = controller.utils.sanatizeInput(data[prop]);
				}
				
				// data.city = controller.utils.sanatizeInput(data.city);
				// data.rent = controller.utils.sanatizeInput(data.rent);
				// data.payment = controller.utils.sanatizeInput(data.payment);
				// data.startDate = controller.utils.sanatizeInput(data.startDate);
				// data.endDate = controller.utils.sanatizeInput(data.endDate);
				// data.locationAddress = controller.utils.sanatizeInput(data.locationAddress);
				
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
	
	
	createAddButton() {
		document.getElementById('addButton').innerHTML = '';
		let temp = document.createElement('div');
		let addButton = this.utils.createButton((this.refPath + this.listing + '/' + this.province), "Add Entry", "addEntry");
		temp.innerHTML = addButton;
		document.getElementById('addButton').appendChild(temp);
		let button = document.getElementsByClassName('addEntry');
		button[0].addEventListener('click', this.addDatabaseEntryEvent.bind(this), false);
	}
	
	
	
}







