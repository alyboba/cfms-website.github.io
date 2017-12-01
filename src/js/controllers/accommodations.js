


export default class AccommodationsController {
	constructor(listing, province) {
		this.listing = listing;
		this.province = province
		this.process();
		
	}
	
	process(){
		$(document).ready(() => {
			console.log($('#accommodationsDatabase'))
			$('#accommodationsDatabase').DataTable( {
				"pagingType": "full_numbers"
			});
		});
		console.log("hello from accommodationsController!");
		console.log(`Listing is ${this.listing}`);
		console.log(`Province is ${this.province}`);
	}
	
}