import Model from './model';

/*
{
  "fileLink" : "https://firebasestorage.googleapis.com/v0/b/amber-heat-9132.appspot.com/o/minutes%2F2009%20AGM%20Minutes.pdf?alt=media&token=8e037aa4-7147-4b10-a542-a9f521aad9b0",
  "filePath" : "minutes/2009 AGM Minutes.pdf",
  "fileTitle" : "2009 AGM Minutes.pdf",
  "subTitle" : "September 25-27, 2009 • Thunder Bay, Ontario",
  "title" : "Minutes from the CFMS Annual General Meeting (AGM) 2009"
}
 */
export default class MeetingMinuteEntry extends Model{
	constructor(year, data, fileObject) {
		super();
		this.year = year;
		this.fileLink = fileObject.fileLink;
		this.filePath = fileObject.filePath;
		this.fileTitle = fileObject.fileTitle;
		this.title = data.title;
		this.subTitle = data.subTitle;
	}
}