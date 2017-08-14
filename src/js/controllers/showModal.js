/**
 * Created by Justin on 7/8/2017.
 */

import Utils from '../utils';

export default class ModalController {
	
	static setCurrentModal(currentModal){
		this.currentModal = currentModal;
	}
	static getCurrentModal(){
		return this.currentModal;
	}
	constructor() {
		this.currentModal;
		this.utils = new Utils();
		this.bindListeners();
	}
	
	bindListeners() {
		console.log("Hit the modalController");
		let buttons = document.getElementsByClassName('clickMe');
		for(let i=0; i< buttons.length; i++){
			let button = buttons[i];
			button.onclick = this.clickTheModal;
		}
		
		let closeModalButtons = document.getElementsByClassName("modalCloseButton");
		for(let i=0; i< closeModalButtons.length; i++){
			let closeButton = closeModalButtons[i];
			closeButton.onclick = this.closeModal;
		}
		
		
		
		window.onclick = (event) => {
			//console.log("Hitting the window onclick");
			if(event.target == ModalController.getCurrentModal()){
				//console.log("Getting into the if?");
				ModalController.closeTheModal(ModalController.getCurrentModal());
			}
		}
		
	} //end bind listeners method
	
	clickTheModal() {
		event.preventDefault();
		ModalController.setCurrentModal(this.parentElement.previousElementSibling);
		this.parentElement.previousElementSibling.classList.remove("fadeOut");
		this.parentElement.previousElementSibling.classList.remove("hidden");
		this.parentElement.previousElementSibling.classList.add("fadeIn");
		this.parentElement.previousElementSibling.classList.add("show");
	}//end clickTheModal
	
	closeModal(){
		ModalController.setCurrentModal(this.parentElement.parentElement.parentElement);
		ModalController.closeTheModal(ModalController.getCurrentModal());
	} //end close Modal
	
	static closeTheModal(currentModal){
		currentModal.classList.remove("fadeIn");
		currentModal.classList.add("fadeOut");
		currentModal.classList.remove("show");
		currentModal.classList.add("hidden");
	}
}