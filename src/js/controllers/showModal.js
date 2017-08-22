/**
 * Created by Justin on 7/8/2017.
 */
//let instance = null;
export default class ModalController {
	constructor() {
		//if(instance){ //Singleton pattern
		//	return instance;
		//}
		this.currentModal;
		this.bindListeners();
	}
	static setCurrentModal(currentModal){
		this.currentModal = currentModal;
	}
	static getCurrentModal(){
		return this.currentModal;
	}
	static closeTheModal(currentModal){
		currentModal.classList.remove("fadeIn");
		currentModal.classList.add("fadeOut");
		currentModal.classList.remove("show");
		currentModal.classList.add("hidden");
	}
	
	//Starting method of class, Other methods below are for events.
	bindListeners() {
			console.log("Are we accessing the modal Controller??");
			let buttons = document.getElementsByClassName('clickMe');
			console.log(buttons);
			for (let i = 0; i < buttons.length; i++) {
				let button = buttons[i];
				console.log("are we getting into the for loop?!?!");
				button.onclick = this.clickTheModal;
			}
			
			let closeModalButtons = document.getElementsByClassName("modalCloseButton");
			for (let i = 0; i < closeModalButtons.length; i++) {
				let closeButton = closeModalButtons[i];
				closeButton.onclick = this.closeModal;
			}
			
			//This event used to close modal when user clicks outside of modal anywhere on webpage
			window.onclick = (event) => {
				if (event.target == ModalController.getCurrentModal()) {
					ModalController.closeTheModal(ModalController.getCurrentModal());
				}
			}
	} //end bind listeners method
	
	clickTheModal() {
		event.preventDefault();
		console.log("click event working?");
		ModalController.setCurrentModal(this.parentElement.previousElementSibling);
		this.parentElement.previousElementSibling.classList.remove("fadeOut");
		this.parentElement.previousElementSibling.classList.remove("hidden");
		this.parentElement.previousElementSibling.classList.add("fadeIn");
		this.parentElement.previousElementSibling.classList.add("show");
	} //end clickTheModal
	
	closeModal(){
		ModalController.setCurrentModal(this.parentElement.parentElement.parentElement);
		ModalController.closeTheModal(ModalController.getCurrentModal());
	} //end close Modal
	

}