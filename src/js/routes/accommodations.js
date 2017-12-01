import AccommodationsController from '../controllers/accommodations';


//Shows Member Account Information on the Members Page
export default function meetingMinutes(ctx, next) {
	let listing = ctx.params.listing;
	let province = ctx.params.province;
	
	
	new AccommodationsController(listing, province);
	
	next();
}