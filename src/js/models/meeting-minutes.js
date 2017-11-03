import Model from './model';

export default class DatabaseEntryModel extends Model{
	constructor(databaseEntryKey, data) {
		super();
		this.key = databaseEntryKey;
		this.obj = Object.assign(data);
	}
	bundleFileWithData(fileObj){
		this.obj = Object.assign(this.obj, fileObj);
	}
	
}