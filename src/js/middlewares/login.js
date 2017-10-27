import LoginController from '../controllers/login';

export default function(ctx, next) {
	new LoginController();
	
	next();
}