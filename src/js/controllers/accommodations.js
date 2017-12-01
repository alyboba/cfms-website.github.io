

export default class AccommodationsController {
	constructor(listing, province) {
		
		this.listing = listing;
		this.province = province
		this.process();
		
	}
	
	process(){
		$('#accommodationsDatabase').DataTable();
		
		
		console.log("hello from accommodationsController!");
		console.log(`Listing is ${this.listing}`);
		console.log(`Province is ${this.province}`);
	}
	
}