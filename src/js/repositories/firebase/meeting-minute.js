import Repository from 'repository';
import {FirebaseRef} from "./utils";

export default class MeetingMinuteRepository extends Repository {
	constructor(Model, refPath) {
		super(Model, refPath);
		this.refPath = refPath;
	}
	
	add(model) {
		this.ref = new FirebaseRef(`${this.refPath}/${model.year}`);
		super.add(model);
		`${this.refPath}/meeting/
		assholes`
	}
}