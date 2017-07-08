/**
 * Created by Justin on 7/8/2017.
 */

export default class PaginationController {
	static getPaginationPage(index){
		return this.paginationPages[index];
	}
	static getPaginationLink(index){
		return this.paginationLinks[index];
	}
	static getPaginationPageLength(){
		return this.paginationPages.length;
	}
	static setPaginationPages(input){
		this.paginationPages = input;
	}
	static setPaginationLinks(input){
		this.paginationLinks = input;
	}
	static setCurrentPage(input){
		this.currentPage = input;
	}
	static getCurrentPage(){
		return this.currentPage;
	}
	constructor() {
		PaginationController.setPaginationPages(document.getElementsByClassName('paginationPages'));
		PaginationController.setPaginationLinks(document.getElementsByClassName('paginationLink'));
		PaginationController.setCurrentPage(1970);
		this.bindListeners();
	}
	
	bindListeners() {
		console.log("In the pagination Controller");
		
		for(let i =0; i<PaginationController.getPaginationPageLength(); i++){
			let button = PaginationController.getPaginationLink(i);
			console.log(button);
			button.onclick = this.showPage;
			//console.log('the id is : ' + PaginationController.getPaginationPage(i).id);
		}
		//console.log("Hit the pagination controller");
		//let currentPage = 1970;
	}
	
	showPage() {
		event.preventDefault();
		let id = 'page'+this.id;
		console.log(id);
		PaginationController.setCurrentPage(this.id);
		for(let i=0; i<PaginationController.getPaginationPageLength(); i++){
			if(PaginationController.getPaginationPage(i).id == id){
				PaginationController.getPaginationPage(i).classList.add('show');
				PaginationController.getPaginationPage(i).classList.remove('hide');
			}
			else {
				PaginationController.getPaginationPage(i).classList.add('hide');
				PaginationController.getPaginationPage(i).classList.remove('show');
			}
		}
	}
}