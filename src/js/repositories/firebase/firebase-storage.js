

import {FirebaseConnection} from "./utils";

export default class FirebaseStorageRepository  extends FirebaseConnection {
	constructor(refPath){
		super();
		this.storageRefPath = refPath;
		this.storageRef = this.firebase.storage().ref(refPath);
	}
	
	fileUploadPromise(file){
		return new Promise((resolve, reject) => {
			// let filePath = fileDirectory + ;
			let storageRef = this.storageRef.child(file.name);
			//console.log(storageRef.getDownloadURL());
			storageRef.getDownloadURL().then( () => { //There already is a file with that name in storage, reject the promise...
				reject("A File With the same name has already been uploaded!");
			}).catch(() => { //There is no file with that name in Db, Lets make one!
				let uploadTask =	storageRef.put(file);
				uploadTask.on('state_changed', (snapshot) => {
					let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
				}, (error) => {
					//This function happens if error hits during upload.
					reject(error);
				}, () => {
					//this is for on complete uploads!
					//console.log("are we ever hitting the final function!?>!?!?!");
					let downloadURL = uploadTask.snapshot.downloadURL;
					let fileObject = {
						downloadURL: downloadURL,
						filePath: this.storageRefPath+file.name,
						fileTitle: file.name
					};
					resolve(fileObject);
				});
			});
		});
	}
	
	addEntry(path, obj ){
		return new Promise((resolve, reject) =>{
			this.ref.child(path).push(
				obj
			)
				.then(() =>{
					resolve("Successfully Added Entry");
				}).catch((error) => {
					reject(error);
			})
		})
	}
	
	
	//Still need to fix this function, split it out etc.
	deleteEntry(fileName){
		let storageReference = this.storageRef;
		return new Promise((resolve, reject)=> {
			let storageRef = storageReference.child(fileName);
			storageRef.delete()
				.then(() =>{
				resolve();
				}).catch((err) =>{
				reject(err);
			});
		});
	}
}