/**
 * Created by Justin on 7/8/2017.
 */

export default class PaginationController {
	
	constructor() {
		this.paginationPages;
		this.paginationLinks;
		this.currentPage;
		this.bindListeners();
	}
	getPaginationPage(index){
		return this.paginationPages[index];
	}
	getPaginationLink(index){
		return this.paginationLinks[index];
	}
	getPaginationPageLength(){
		return this.paginationPages.length;
	}
	setPaginationPages(input){
		this.paginationPages = input;
	}
	setPaginationLinks(input){
		this.paginationLinks = input;
	}
	setCurrentPage(input){
		this.currentPage = input;
	}
	getCurrentPage(){
		return this.currentPage;
	}
	bindListeners() {
		this.setPaginationPages(document.getElementsByClassName('paginationPages'));
		this.setPaginationLinks(document.getElementsByClassName('paginationLink'));
		console.log("In the pagination Controller");
		for(let i =0; i<this.getPaginationPageLength(); i++){
			let button = this.getPaginationLink(i);
			//console.log(button);
			button.onclick = this.showPage.bind(this); //binds the context into the sub methods of the events.
		}
	}
	showPage() {
		event.preventDefault();
		//let paginationController = new PaginationController(); //Create an object so we can access the methods above.
		let id = 'page'+event.target.id;
		let pageId = event.target.id;
		this.setCurrentPage(pageId);
		for(let i=0; i<this.getPaginationPageLength(); i++){
			if(this.getPaginationPage(i).id == id){
				this.getPaginationPage(i).classList.add('show');
				this.getPaginationPage(i).classList.remove('hide');
			}
			else {
				this.getPaginationPage(i).classList.add('hide');
				this.getPaginationPage(i).classList.remove('show');
			}
		}
	}
}