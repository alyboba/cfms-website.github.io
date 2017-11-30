import Model from './model';

export default class MeetingMinutesModel extends Model {
	constructor(meetingMinutes) {
		super();
		Object.assign(this, meetingMinutes);
	}
	
	static fromRow(row) {
		return new MeetingMinutesModel(row);
	}
	
	static fromRows(rows) {
		return rows.map(row => new MeetingMinutesModel(row));
	}
}