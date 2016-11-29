
// Add the RxJS Observable operators we need in this app.
import './rxjs-operators';

// Promise Version
import { Component, OnInit } from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {DND_PROVIDERS, DND_DIRECTIVES} from 'ng2-dnd/ng2-dnd';

import { Location }          from './location';
import { Item }              from './item';
import { MatchService }      from './match.service.promise';

class Product {
  constructor(public name:string, public quantity:number, public cost:number) {}
}

@Component({
  selector: 'match-app',
  directives: [DND_DIRECTIVES],
  templateUrl: 'view/main.html',
  providers: [DND_PROVIDERS , MatchService ]
})

export class AppComponent implements OnInit {

//experiment zone

 recyclBin:Array<string> = [];

    availableProducts: Array<Product> = [];
    shoppingBasket: Array<Product> = [];
    
    listOne:Array<string> = ['Coffee','Orange Juice','Red Wine','Unhealty drink!','Water'];

    listBoxers:Array<string> = ['Sugar Ray Robinson','Muhammad Ali','George Foreman','Joe Frazier','Jake LaMotta','Joe Louis','Jack Dempsey','Rocky Marciano','Mike Tyson','Oscar De La Hoya'];
    listTeamOne:Array<string> = [];
    listTeamTwo:Array<string> = [];

    orderedProduct(orderedProduct: Product) {
        orderedProduct.quantity--;
    }

	reOrderItemsA(item: Item) {
	  alert('ss');
        console.log("reOrderItems called:");
        console.log(item);	
	}
	
	reOrderItemsB(item: Item) {
        console.log("reOrderItems called:");
        console.log(item);	
	}
	
    addToBasket(newProduct: Product) {
        for (let indx in this.shoppingBasket) {
            let product:Product = this.shoppingBasket[indx];
            if (product.name === newProduct.name) {
                product.quantity++;
                return;
            }
        }
        this.shoppingBasket.push(new Product(newProduct.name, 1, newProduct.cost));
    }

    totalCost():number {
        let cost:number = 0;
        for (let indx in this.shoppingBasket) {
            let product:Product = this.shoppingBasket[indx];
            cost += (product.cost * product.quantity);
        }
        return cost;
    }

    itemsABin:Array<Item> = [];
    itemsBBin:Array<Item> = [];

//end of experiemnt zone

  errorMessage: string;
  
  debug=false;
  
  debugItems = [];
  
  locations: Location[];
  categories:Array<string> = [];
  
  page = 'items';
  
  nameA = "Applicant A";
  nameB = "Applicant B";
  nameA1 = "A";
  nameB1 = "B";
  
  optionWhoLeading = "A";
  
  editA = false;
  editB = false;
  
  itemsA:Array<Item> = [];
  itemsB:Array<Item> = [];
  autoItems = [];
  manualItems = [];
    
  selectedItem = [];
  
  public importItem = {"order":0,"location":"","category":"","note":""};
  
  constructor (private matchService: MatchService) {}

  ngOnInit() {
     this.getLocations(); this.getCategories();
     this.importItem={"order":0,"location":"","category":"","note":""};
    // this.itemsA=[];
    // this.itemsB=[];
     
     
     if (this.debug){
       this.itemsA = this.getItemsA();
       this.itemsB = this.getItemsB();
     }
   
          this.availableProducts.push(new Product("Blue Shoes", 3, 35));
        this.availableProducts.push(new Product("Good Jacket", 1, 90));
        this.availableProducts.push(new Product("Red Shirt", 5, 12));
        this.availableProducts.push(new Product("Blue Jeans", 4, 60));
   
     
  }


  getItemsA() {
    this.matchService.getItemsA()
                     .then(
                       itemsA => this.itemsA = itemsA,
                       error =>  this.errorMessage = <any>error);
  }
  
   getItemsB() {
    this.matchService.getItemsB()
                     .then(
                       itemsB => this.itemsB = itemsB,
                       error =>  this.errorMessage = <any>error);
  }
  
  

  getLocations() {
    this.matchService.getLocations()
                     .then(
                       locations => {
                       		this.locations = locations;
                       		let ltag = [];
                       		for (let i=0; i<locations.length;i++)
                       		ltag.push(locations[i].name);
                       		$( "#location" ).autocomplete({
     						    source: ltag
    						});
                       },
                       error =>  this.errorMessage = <any>error);
  }

  getCategories() {
    this.matchService.getCategories()
                     .then(
                       categories => {
                             this.categories = categories;
                           	 $( "#discipline" ).autocomplete({
     						    source: this.categories
    						 });
    				   },                       
                       error =>  this.errorMessage = <any>error);
  }
  
   DoneEditApplicant(who) {
	  if (who=='A'){
		  if (this.nameA.length==0){
			  this.nameA="Applicant A";
			  this.nameA1="A";
		  }
		  this.nameA1=this.nameA.substring(0,1).toUpperCase();
		  this.editA=!this.editA;
	  }
	  else{
	  	  if (this.nameB.length==0){
			  this.nameB="Applicant B";
		  	this.nameB1="B";
	  	  }
		  this.nameB1=this.nameB.substring(0,1).toUpperCase();
		  this.editB=!this.editB;
	  }
  }

  SetCategory(event) {
	this.importItem.category=event.srcElement.innerText;
	//console.log(event.srcElement.innerText); 
	// console.log(event);
  }

  SetLocation(event) {
	this.importItem.location=event.srcElement.innerText;
	//console.log(event.srcElement.innerText); 
	// console.log(event);
  }

checkInput(location, discipline){
 console.log("check input:" + location + "," + discipline);
     if (location.length==0){
		  alert("Please select the Location.");
		  return false;
	  }
	  
	  if (discipline.length==0){
		  alert("Please select the Discipline.");
		  return false;
	  }
	  
	  let index=-1;
	  for (let i=0;i< this.locations.length;i++){
	  	if (location==this.locations[i].name){
	  	   	index=i; break;
	  	  	}
	  }

	  if (index==-1){
	   alert("Unable to find the location, please use the drop down menu to select the location.");
	   return false;
	  }

      index=-1;
	  for (let i=0;i< this.categories.length;i++){
	  	if (discipline==this.categories[i]){
	  	 	index=i;break;
	  	 }
	  }

	  if (index==-1){
	   alert("Unable to find the Discipline, please use the drop down menu to select the discipline.");
	   return false;
	  }
	  	  
	  return true;	  

}

  AddItem(who) {
    //validate the importItem first:

      let location = $('#location').val();
      let discipline = $('#discipline').val();
      
      console.log(location);
      console.log(discipline);
      
      console.log(this.importItem.location);
      console.log(this.importItem.category);
       
       if (this.checkInput(location,discipline)==false){
         return;
       }
      
       this.importItem.location = location;
       this.importItem.category = discipline;
       
   	  console.log("add new now...");
	 
      if (who=='A'){
         let order = this.itemsA.length;
         this.importItem.order=order;
	  	this.itemsA.push(this.importItem);
	  	}
	  else{
	     let order = this.itemsB.length;
         this.importItem.order=order;
	     this.itemsB.push(this.importItem);
	    }
	    
	  this.importItem={"order":0,"location":location,"category":discipline,"note":""};
	  
	  	  
	   
  }
  
  SetPage(page){
  
  	  if (page=='rank')
		  this.makeAutoItems2();
	  if (page=='manual')
		  this.makeManualItems2();
		  
	  this.page=page;
  }
  
  AutoReMatch(who) {
      this.optionWhoLeading = who;
	  this.makeAutoItems2();
  }

  makeAutoItems2(){
		 
	  this.autoItems = [];
	  
	  for (let i=0;  i < this.itemsA.length; i++){
	    this.itemsA[i].order=i;
	  }
	  
	  for (let i=0;  i < this.itemsB.length; i++){
	    this.itemsB[i].order=i;
	  }
	  
	  
	  for (let i = 0; i < this.itemsB.length; i++) {
		  let bItem = this.itemsB[i];
		  for (let j = 0; j < this.itemsA.length; j++) {
	    	  let aItem = this.itemsA[j];
	    	  let newAutoItem={'distance':0, 'order':0,'b':0,'a':0, 'p':'b','B':{"order":1,"location":"","category":"","note":""},"A":{"order":1,"location":"","category":"","note":""}};
	    	  newAutoItem.B = bItem;
	    	  newAutoItem.A=aItem;
	    	  
	    	  newAutoItem.distance = this.GetDistances(bItem.location, aItem.location);
	    	  
	    	  let z=i + j + 2;
	    	  newAutoItem.order = z;
	    	  newAutoItem.b = i+1;
	    	  newAutoItem.a = j+1;
	    	  newAutoItem.p = (this.optionWhoLeading=='A')?'a':'b';
	    	  this.autoItems.push(newAutoItem);
		  }
	  }
	  	  	  
	  console.log(this.optionWhoLeading);
	  
	  this.autoItems.sort(this.CompareTwo);
	  
  }
  
    makeManualItems2(){
		
	  if (this.manualItems.length!=0){
		  return;
	  }
	  
	  this.manualItems = [];
	  
	  this.makeAutoItems2();
	  
	  this.manualItems=this.autoItems;	  
	  
	  
  }
  
    CompareTwo(itemA,itemB){
	
	
	if (itemA.distance < itemB.distance)
	  return -1;
	if (itemA.distance > itemB.distance)
	  return 1;
	
	  if (itemA.order<itemB.order)
		  return -1;
	  
	  if (itemA.order>itemB.order)
		  return 1;

	  if (itemA.order==itemB.order){
		  
		  let minA = Math.min(itemA.h, itemA.k);
		  let minB = Math.min(itemB.h, itemB.k);
		  
		  if (minA<minB)
			  return -1;
		  else
			  if (minA>minB)
				  return 1;
			  else{ // equal with order and the min. now check the who is the leading person
				  console.log(itemA.p + " itemA.k = " + itemA.k + " itemA.h = " + itemA.h);
				  if (itemA.p=='b' && itemA.b < itemA.a)
					  return -1;
				  else
					  return 1;
				  
			  };
	  }
	  
	  
  }
  
  GetDistances(locA, locB){
  
   let d = 0;
   let locations = this.locations;
   let indexlocA = 0;
   let indexlocB = 0;
   
   console.log("get distance: d=" + d + " for " + locA + "<-->" + locB);
   
   for (let i=0; i<locations.length; i++){
    let loc = locations[i];
    
    if (loc.name==locA){
       indexlocA = loc.id;
    }

    if (loc.name==locB){
       indexlocB = loc.id;
    }
    
   }
   
   //console.log("indexlocA: " + indexlocA + " indexlocB: " + indexlocB);
   let range = indexlocA-indexlocB;
   let maxIndex = range>0?indexlocA:indexlocB;
   
   if (range<0)
    range=-range;
    
   //console.log("indexlocA: " + indexlocA + " indexlocB: " + indexlocB + " range: " + range);
   let pos = locations[maxIndex-1].d.length-range -1;
   d=locations[maxIndex-1].d[pos];
   
   console.log("d: " + d + " indexlocA: " + indexlocA + " indexlocB: " + indexlocB + " range: " + range);
   
   return d;  
  }

  onDelete(item, who) {
    
	console.log(item);

if (who=='A')   
   	this.itemsA.splice( this.itemsA.indexOf(item), 1 );
   	
if (who=='B')   
   	this.itemsB.splice( this.itemsB.indexOf(item), 1 );
   	
		  	  
  }
  
  onDeleteManualItem(item){
	console.log(item);
   	this.manualItems.splice( this.manualItems.indexOf(item), 1 );
  }

  onSelect(item: Item) {
	  this.selectedItem = item; 
  }

  onItemDown(item, itemList) {
	  
	  console.log(item);
	  
	  let index = itemList.indexOf(item)
	  
	  console.log(index);
	  
	  let length = itemList.length;
	  
	  console.log(length);
	  	  
	  if (index>=(length-1))
		  return;
	  
	  let next = itemList[index+1];
	  
	  itemList[index+1] = item;
	  
	  itemList[index] = next;
	  
	  this.selectedItem = itemList[index+1];
	  
  }

  onItemUp(item, itemList) {

	  console.log(item);
	  
	  let index = itemList.indexOf(item)
	  
	  console.log(index);
	  
	  //var length = this.manualItems.length;
	  
	  console.log(length);
	  	  
	  if (index==0)
		  return;
	  
	  let previous = itemList[index-1];
	  
	  itemList[index-1] = item;
	  
	  itemList[index] = previous;
	  
	  this.selectedItem = itemList[index-1];

	  
  }

  OnGenerate(){
	  this.manualItems=[];
	  this.makeManualItems2();
  }

  onDeleteManualItem(item) {
	  console.log("onDeleteManualItem(item)...");
	  console.log(item);
      this.manualItems.splice( this.manualItems.indexOf(item), 1 );
  }

  OnExportAsPDF(){

	  console.log("OnExportAsPDF()");
	  
	  if (this.manualItems.length==0){
		  alert("There is nothing to be exported.");
		  return;
	  }
	  
	  let docDefinition = {
			  pageSize: 'A4',
			  // by default we use portrait, you can change it to landscape if you wish
			  //pageOrientation: 'landscape',
			  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
			  pageMargins: [ 40, 60, 40, 60 ],
			  content: [
			    {
			      image: 'data:image/jpeg;base64,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AAAAAAAAAEJsZCBVbnRGI1JsdAAAAAAAAAAAAAAAAFJzbHRVbnRGI1B4bEBSAAAAAAAAAAAACnZlY3RvckRhdGFib29sAQAAAABQZ1BzZW51bQAAAABQZ1BzAAAAAFBnUEMAAAAATGVmdFVudEYjUmx0AAAAAAAAAAAAAAAAVG9wIFVudEYjUmx0AAAAAAAAAAAAAAAAU2NsIFVudEYjUHJjQFkAAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNBA0AAAAAAAQAAAAeOEJJTQQZAAAAAAAEAAAAHjhCSU0D8wAAAAAACQAAAAAAAAAAAQA4QklNJxAAAAAAAAoAAQAAAAAAAAACOEJJTQP1AAAAAABIAC9mZgABAGxmZgAGAAAAAAABAC9mZgABAKGZmgAGAAAAAAABADIAAAABAFoAAAAGAAAAAAABADUAAAABAC0AAAAGAAAAAAABOEJJTQP4AAAAAABwAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAADhCSU0EAAAAAAAAAgACOEJJTQQCAAAAAAAIAAAAAAAAAAA4QklNBDAAAAAAAAQBAQEBOEJJTQQtAAAAAAAGAAEAAAANOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAAz0AAAAGAAAAAAAAAAAAAABkAAACDQAAAAQAbABvAGcAbwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAACDQAAAGQAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAGQAAAAAUmdodGxvbmcAAAINAAAABnNsaWNlc1ZsTHMAAAABT2JqYwAAAAEAAAAAAAVzbGljZQAAABIAAAAH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amMAAAABAAAAAAAAbnVsbAAAAAIAAAAARnJJRGxvbmdQi99CAAAAAEZyR0Fkb3ViQD4AAAAAAAAAAAAARlN0c1ZsTHMAAAABT2JqYwAAAAEAAAAAAABudWxsAAAABAAAAABGc0lEbG9uZwAAAAAAAAAAQUZybWxvbmcAAAAAAAAAAEZzRnJWbExzAAAAAWxvbmdQi99CAAAAAExDbnRsb25nAAAAAAAAOEJJTVJvbGwAAAAIAAAAAAAAAAA4QklND6EAAAAAABxtZnJpAAAAAgAAABAAAAABAAAAAAAAAAEAAAAAOEJJTQQGAAAAAAAHAAgAAAABAQD/4RJwaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wOkNyZWF0ZURhdGU9IjIwMTEtMTAtMDZUMTY6NTE6NDgtMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMTEtMTEtMThUMTk6MzM6MDMtMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDExLTExLTE4VDE5OjMzOjAzLTA4OjAwIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMjgwMTE3NDA3MjA2ODExOEY2MjgyODZBREM2RTJCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExOERCQkZDQUVBNkVBMjJDMiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjBBODAxMTc0MDcyMDY4MTE4REJCRkNBRUE2RUEyMkMyIj4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJQcm91ZCBTcG9uc29yIiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJQcm91ZCBTcG9uc29yIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+eG1wLmRpZDowNTgwMTE3NDA3MjA2ODExOTdBNUY0QjA0QUI2ODVEMTwvcmRmOmxpPiA8L3JkZjpCYWc+IDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBBODAxMTc0MDcyMDY4MTE4REJCRkNBRUE2RUEyMkMyIiBzdEV2dDp3aGVuPSIyMDExLTEwLTA2VDE2OjUxOjQ4LTAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDE4MDExNzQwNzIwNjgxMTg3MUY4MjQwRUQzRDM2MzgiIHN0RXZ0OndoZW49IjIwMTEtMTAtMTBUMTQ6MTg6MjAtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExOEY2MjgyODZBREM2RTJCRSIgc3RFdnQ6d2hlbj0iMjAxMS0xMS0xOFQxOTozMzowMy0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvanBlZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDI4MDExNzQwNzIwNjgxMThGNjI4Mjg2QURDNkUyQkUiIHN0RXZ0OndoZW49IjIwMTEtMTEtMThUMTk6MzM6MDMtMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowMTgwMTE3NDA3MjA2ODExOEY2MjgyODZBREM2RTJCRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowNjgwMTE3NDA3MjA2ODExOERCQkZDQUVBNkVBMjJDMiIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjBBODAxMTc0MDcyMDY4MTE4REJCRkNBRUE2RUEyMkMyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/4gxYSUNDX1BST0ZJTEUAAQEAAAxITGlubwIQAABtbnRyUkdCIFhZWiAHzgACAAkABgAxAABhY3NwTVNGVAAAAABJRUMgc1JHQgAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLUhQICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABFjcHJ0AAABUAAAADNkZXNjAAABhAAAAGx3dHB0AAAB8AAAABRia3B0AAACBAAAABRyWFlaAAACGAAAABRnWFlaAAACLAAAABRiWFlaAAACQAAAABRkbW5kAAACVAAAAHBkbWRkAAACxAAAAIh2dWVkAAADTAAAAIZ2aWV3AAAD1AAAACRsdW1pAAAD+AAAABRtZWFzAAAEDAAAACR0ZWNoAAAEMAAAAAxyVFJDAAAEPAAACAxnVFJDAAAEPAAACAxiVFJDAAAEPAAACAx0ZXh0AAAAAENvcHlyaWdodCAoYykgMTk5OCBIZXdsZXR0LVBhY2thcmQgQ29tcGFueQAAZGVzYwAAAAAAAAASc1JHQiBJRUM2MTk2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dDD3P5O5e95+Sbz3+9r9tW13i3P/ACINrjz9PMRVr63UZMEuXkoKU1SEB0npdr7k7rDnr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//0N/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3RKOn5U7P8Al18ke2o9NRgOpMHs74sbOrEYmGbOYwHtPuWogvwxXO7qwWKmZeBUYORDyhsGduIvuYd63AZit1S1Q/0h+rN/xpkQ/ND6dTFzYp5b9qvb3lZu2+3WafeZ1PERv/iVgD/zbhuZ1/oXKngesnzz+Hm2fmn0FnOta6aHB79wko3d0/vtRJFX7J7FxMTyYeuiraYrWwYrJsPtK9YjqNPJ5EHmihZfc18uw8y7TLZMQt2vfC/mkg+E1GaHg1PI14gdV9kPdncfZ/nmy5ihQzbHMPAv7bBW4tXIEilT2l0+OInGsaSdDOCE/wDLJ+V+7vkN1BuDrvuymqcN8n/jZuJ+p+9cHkgsWUrcrizUUuE3rLCFVWTdFLQSieRLxSV9NUPHaJ4rl/JG/wBxu+3TWe5grvlk/hTqeJIwr/7YDP8ASBIwR0J/vG+2G1chc2WG/wDJ0ize23MVv9btsiZRUehktwf+Esw0g5ETxhu8N0ffb3Y+wN2bj3js/bG9drbh3X17W0GN31tvDZ7G5LObQr8pRJkcdSbkxdJUy1mHnrqKQSRLOiF1BtyrAC2G9s7ia5toLqN7iEgOoYFkJFQGANRUcK9Qff8AL++7Xt+07tuWz3MG136M9tLJG6RzqjFHaJ2AWQKwoSpNMV4iq09qeijr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//0d/j37r3Xvfuvde9+691737r3XvfuvdVa/L/APmA9qdBdp5jYPSnxgzfyQoOqdk7S7F+QFRtvc5xm4tl7Z35kdx0O2F27tqmwmayO4agUu06yrrZkjaKkheDyBVd5EAnMXN1/tN/LabZsbXq28SSXGlqMiyFgulQrFsISx4AUr5kZLe1HsVyzzxyzab5zj7kQ8vT7peT2m2CWHXFcTWyRNN4sxkjSIap40jUkM7B9JJAVn/a/wDNG+NXbHQ2T7K6W3bjN0dr1NAMHtH47ZWuoMV3Dlu18u4xW19gS7MasbJ1X3u4qiFKivohU0EFCJatphDDIyvQc9bLuG0ve7bcK9+RpS3JAmMpwseitTVqVZaqFq1aA9INy+7X7icr8723LvOG1yW3LCv4k+6orPYJZJ3zXQuNOhdMQYrFJolaTTEE1uoJrfjB05U9E9I7K6+zGUTcG8o4cnujsrdCg33Z2lvjL128Ox9yF2VJXhyu8M1VvThxqjpfFH9EA9n+x7cdq2y2tJH13OWkb+OVyXkb83Jp8qDy6jH3I5ti525y3jfrS2MG0EpDaQ/74s7dFgtIfSqQRxhqYL6m8+h+9m3QG6rU3T8Bd31vzd3Z8s+uvkXuPqHBdn9cbe2J23sXZ20sFPnt5f3eNPTwzUO78y9fSbaeqx+PpR9/DjZMtSvFJ9tUReYsgKn5TuW5nn5gs95e3inhWOVERdT6fRzULUAdwXWKHSRXGRG2e+O0w+ze1+12/wDIFvut7tu4S3NjczzyCKDxakhoI9LTaWZ/02mEDhl8SNtFGKv8quv8R8Efmv8AEz5g9W42Pa/V/bm4MT8UPkpiKJ6j+H5KDdj22DvrOzTTTVWVzsGQgM1ZX1LyVNTNjYmlkeSomZyHfrOPlXmbl/mKwTw7G4cWtyBWh1/2bt6tXJY5JUVJJNZM9st9uvez2d90fafma4NzzLtUD73tDtTUhg/3KtowAFSModMcaAIiyuFUKiAXp+5T6wr697917r3v3XuvH6G31/339PfuvdcC6qCWNgASxPAVR9WYk2CgD6+/de61af5o/wDwqh+HfwU3PuLpjobDH5Y977fbI43PJtnOU+O6n2PuCjmWA4ncO8qeOrkz+Qp50lSppsYrCBlAabVdV917rVk7R/4WLfzU93Z2Wv65xPx+6kwjzSyQ4Cj66G8xFCx/bgbJ7qyFTWOIgLauCT9ffuvdCX8bP+FiH8zKh3ptvbvaXWXRXfce487jcFTYuj2rW9fZeoqczkYKGkgx8+160wGs8k4WIPEyMxGoH37r3X00cBVZSuwWFrc1QxYzMVeJx1VlsbTz/dwY/JVFHDNXUUFUVQ1MVLVO0ayWGsKDb37r3WlF/PB/4UifMX+Wt8/d4fF3p3rnpvc+w8H1511umhyG8sZmp89/Et0UFfV5NZqmiyVPA9NrjjEa6AUCnk34917qon/oNA/mKEgf6Fvjn/56dzc/0POY9+690ZH4df8ACt357fIT5V/HrpDdPUnQWO2z2r23szY24K3FYvcMeTp8TuLLQ46rmoJJsrJFFVxJNrQsrC62I59+691u+/zHvk3n/hv8FPk/8n9p0+Drt2dNdQbq3ttXH7lExweR3NjcezYLG5BKZo53gyGUeKHSrAkuBce/de6+fgf+Fn/8xSx09L/HIG3BOJ3Lb/bfxge/de635/5WnzUb+YN8D/j78rq6gwuF3P2VtaoO+Nu7fqJqjG7c3rhMvX4TO4mnepJmVBLRLUIrkssc6g+/de6AD+eP/Mmz38rT4Ibj+R2xsHgNzdnZXf2y+teuMHubyyYWfPbjnrslX12TpKaopqypoMftzA1rN43XTK0dzyAfde60oKX/AIWefzD5Kulin6X+OqwyVMCTlMRuXWIWmRZtH+5cjVovbj6+/de6+kn0jv5u1umeo+0WiSFuyesNgb+MUcbxRxHeO1MTuJo44pCZI0Q5GwViSoHPv3Xutbv+c/8A8Kaumf5aW/Kv45dG7GxXyL+TWJhgqN7Y+vzU+M626sapEU1Lht2ZHEscrlt1VVHJ5WoKR4TSRlDNIGcIPde61NNyf8K/v5vGVz9RksBmeg9q4WWfyU+24OnsTl4aWEOW8BymUq5cjOCnpLFg3FxY+/de62cv+E+P/Cgn5Q/zT+7t1/HbvPoLY1C2wurqvfWY7s68qsli6Na+HM0mNx2L3FtavlrKKnmz4qpftmo3jVfs31Kbg+/de627ffuvde9+691737r3XvfuvdJ7d2cbbG1Nz7kSnFW+3tvZrOLSs/jWpbE42pr1py4BKCY0+m/4v7917r59sf8Awt87I8aeX4LbI8uhfJ4+0c94/JpGvRqxGrRqva/Nvfuvdc/+g3zsT/vBbZf/AKNDOf8A1o9+691e9/Iv/n27p/nA9j95bF3B8fcF01B1HtPbm5qPIYfdmQ3HJmDm8lPjpaSpiraOlWm8DQalK3uDz7917qr/AOa3/CvffvxL+X3yZ+MNJ8ONo7uougu7uxupaLdNT2LmcfVbhpdjblr9vxZiqoIsXLFRz14ovI0aMyrqsD7917osP/Qb52J/3gtsv/0aGc/+tHv3Xuj+/wAsH/hVTvb+YT82umviXlPiZtjrvH9qVmapJ934/fuVzFZiDisLW5dJI8fU46nhqFmNGUN2BGoH/W917qyb+ev/ADuM1/J4x/QNRt/pXAdz1vdFdu2Cqocxuqs23JhKPbMFA4q6daKlq3qlqZ60ISwCqV+t/fuvdUwfE3/hZHlO+vk10N0hv74i7Y6/2l2/2ns/rXK70x/YWWyVVtt965an27isolFU4uKnnggzWQpvPrZVSAu1/T7917repDBtJUhlIBBWxDKwuGBHBUj839+691q1/wA7n/hR6P5TfyV2H8bNndCYXuzcWd6qx/Z+76/K7trdvQ7bptwZ/PYTbuKgWgpKvz1tSm2qmomWTSY4niI4ce/de6Af+U5/wqS3H/Mg+bnXHxK3R8Ydr9TY3sHC7wq6beOP3xls7Ww5bbuDnzGPxseOqcfTQOmTNO0ZcvdDawPNvde63Dbn/YDg2/J+n+wt7917qtj+Yf8AzZPhZ/LG2ZTbj+TXZkFBunOU80uzup9rRx7g7M3cyRTMk9DtyCZJqDDeeIRSZCrMNLGzAamay+/de61Cu7f+Fum8P7xVcPx0+FG102omlKOv7k33mKrOzkKoeaWg2amNoqdXYMVTzOUBALNYk+690G+yv+FufyLgzNL/AKRPhX0vkdumojNaNnb13tic0lLcCb7WTMT5eheaw9OtAL8H37r3W9J8CPlxQfO34l9NfLHD9dbk6rwfdG3ZtzYPZ268hjsrmKPFJkq3HU1ZJXYtIqaopcg1C0sD+ONnhZWKDUPfuvdHC9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//0t/j37r3Xvfuvde9+691737r3XvfuvdVO/HmoqKz+bV/MMLiTwY/pz4p42Ml7ooO2srXKoHGnXJVSNa39eefYA2clvcHnCvAW1qP+Mk/5T1lBz7HHF91r2FAI1ybtvTn/nMi/wCBQOj5npD47bM35X98t1b1JtXsaOiqabJdrttTauE3JFSV7CKses3Y1HTVUTV3kEUszzCSVW8bMVOn2KX27ZLK5k3mSztoroDumKopAPGrkCleBJOeHUDX3uHze3LH9WNz5zvzyhGyt9NLdSfTKV+H9Nn8MBTTSKaQ1CBXPQ2I6SoskbK8bqHR0IZHRgCroykqyspuCOCPZqCCAQag9BcEEAg1B65+99b697917quH+bJs6LevwY7Tx8cHmzmP3N05ldolReePdsfcmw6HCCkt6xVVU+QNOmnk+a359gzn+2FzytfpT9UPCU/0/jRhafPNPz6yC+67uzbP71cszs9LKS2v0n9DAbC5aTV/RAXUf9L1Y3GHWONZGDyKih3AsHcKAzAfgM3PsZDgK8esfmoWJUUWvXP3vrXXvfuvde9+691qh/8ACrD+ahu34P8AxU2z8buj9yf3d7y+VsedxWQ3HispLRbn2J1Fi446bc2Zw603jqaTIbmq6pcbT1aSo0CiYqCwUj3Xuvnufyv/AOW/3N/NN+Vu2fjb1TXQbfp6imn3Z2b2Rl6SqyWI672Fj6iCPM7mr6aneOTI5CaaqSnoaUyw/d1s0cZkRSzr7r3X0q/jp/wli/lBdH7Exm296dF5X5F7wip1XOdkdwbz3Q+Xy1W6RGoNLt7aOV21tLC0InVjBHFRtURxsEknlI1n3XuhYT/hNr/KJw3aPVXcXXvxtm6s3v1L2JtfsfDz7J37vM4XO1+06yKvoMHubbO6cxuXb9XgKmqgR6hKempaqQrxOLm/uvdXthQOAAAOAB9Bb+g+g9+6918m7/hW1/2+Q7H/AMel+mP/AHTZL37r3V+/8i3+QT/LA+af8s7oT5D/ACF6LzW8O197y7zG49xUnZ3Ym3oq0YndOTxlCiYrB7jocXTLDR0qr+3CpY8kk+/de6u16r/4TVfyhul+yti9tdffHjcGH3z1vujEbx2nlJu3ezsjDQZ7B1SVmNq5aCv3PPRVkcFTGr+OVGRivIPv3XulL/wo93E+2P5L3zgrolpWNZsTa23iKtykSw7o7F2ht2Vo21pqqkiyTGEX9UoUWN7H3Xuvkmda9HVHY3THfXZ2NlrHr+laTZOZqsfCiGkmwG483PhsrXVTeKSVWx8hhKWKLZiSfoPfuvdfQc/4RX/Jcbx+I3yQ+LOUrKYV3SvbFB2JtiiMpesqNt9pYww5udIzGGjo8fn9tottRXXV3Auze/de6Ih/wtg+Uj5rtT4o/D7EVZ+y2NtXcHdm74aepGh81vGqG2tt0WQgSa/moMRgp6iIPGLJWagTq4917rTh+UHx13F8Wex8H1ruyomk3XJ1315vjPUNTQyUL4XJb121QbkfC+KR/NNHj461UEjrG0g50L9PfuvdfZv+Ie+8pQfywPi72YKJarNUvwO6P3v/AA6gSZUmykfx/wBr5v7SjivU1Co9WNEa3dwLC5PPv3XuvjE7o3BWfIb5XZfcXce9a3HVHcPe09V2Nv3PVUlTWYem3jvnx7gz9fUViyn/AHDUVbJJ+4NCLCAbKLD3Xuvq29T/APCa7+SjhOrNpYOk+LG1+2aOXbWMYdobh7A3znNwb5jq8fA43Wc7gd2UOKVs1G4qY2xcdNRoJAYERbe/de6NL/L4/k3fDL+WL2f3r2R8TcNvTasXfmK2diM/s3cW65t2bd2zRbKny9TQU+0KvL08u5qamrajNSy1C1tfXM0ltLKoVR7r3VrXv3Xuve/de697917r3v3XukB2v/zK3sr/AMMDeX/vO5H37r3XwsPjf11g+3vkF0l1VuaoydHt3sftTYeyM7VYWempsvTYnc+5cbh8hPi6itpMhSQV8VLWMYnlgmjVwCyMOD7r3X0k/wDoCy/lef8AP8Pm/wD+jG6T/wDufvfuvdWq/wArb+RZ8Tf5SW8uz97/AB03/wB+bxyva+38RtzcNP3BujYuex9FQ4WulyFNJh4dodc7HmgqpJ5iJGmknBXgAe/de6+W9/Oc/wC3tH8x7/xc35Cf+/Iz/v3Xut1L4s/8JBP5bPeHxp6C7k3R3L8y8fuXtPp7rrf+focH2D07BhaTM7s2pi83k6fEwVvRNfWQY2KsrXECSzzSLGAGkcgsfde6su+Dv/CXr4E/AT5N9b/Kvp/tb5Wbh7B6vqsnV4DEdg736uye0auXKYuqxM4y9Bt7p7bGWqI0pqxygjrYrOATcC3v3XuqAP8Ahb9nge4fgbtf7QenrXt3Pfe+ccg7o21jvtPt/FxbRr1+T/DT+ffuvdaZG9ur93dI4P499qQZWalqu1NpP2ts3IUiLDPh5ttb7zu2qd4JxJIGq6PK7Y8wJClSV9P0J917r7ZXwY+QOF+T/wAM/jV8isS7Q4rtTpXYm9H+6dfJSzVu36RslHVEsTFNT1kUokVjdGBDcg+/de6+Tx/M53Zvf+aP/OU+XFZsOqFU02/Ow9qbJFRNLWYuk2H8ctrV+Enq8f42Z4sVlKPY1ZlV0g+qtZyt2I9+6908f8JtNwttr+c98NlSnjrhmt2bn22zeVo0hTJbOz6mtjvGxkMQguqkLe/1Hv3XuvqS/wAzr507U/lyfCruj5V7kpaXMZHY+BNFsLa1XUCBN29i56QYzZ2BfTLFO9HLlJlmq/ETIlHDKy2I9+6918artTtT5M/zDPlFkN8b5yu7O7/kT3/vyloaGk1tXZPL5/P1sWOwG1tu0BMdDh8Ljo3ipKKkiEFHRUkKqBHGlx7r3W+P8Bf+EZ/x+wnXO2d4/wAwPtXsDfXbWax1HlMv1V1Hl8btDrzZE9ZSh5ttZLc0+MzG4975LHO4ElZSyYmlEoZEilRVlf3Xujn9qf8ACOz+VVvfbs+P2HmfkT1DuJKeo/h24dv9iYnccArHjIpny+G3ftbMQ5ChilszxQS0crrcCVCb+/de62X+gum9qfHjpLqjorZEEcG1OpNgbW2Bg/HAtMJ6PbOHpcZ969OskqwT5CWB55EDMA8hsSPfuvdC77917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r//09/j37r3Xvfuvde9+691737r3XvfuvdVdfGfCyH+Zn/Mq3DpYwptv4h4ZZGLMBNL1pm8hLEpJ0qFjjQ6f8fx+QLskR/rtzrN5aLRf+qbHrJP3FvB/wADn93ewr3m43ySnyF5GoP7a56Nd8ycTic58We98XmYGqqSp65zxp6dLmSfMU8C1W34oVHMk756GmEac63stjf2p9woILnknmeG4XUhtHoPMuBVKfPWFoPM46w49xreC65F5pguU1RtZyUHmXArHT5+IFoPM46qe/lv/K3e+w9xbJ6G7cqclP172bTVA6Zz+beSX+DZmiyVdh325Q5CZnebbuTy2Ono4oGYmhyCJGgWOeywX7Q88bltl3tvLG/O52q8U/SSPnQ4YoY1Y8Y2ZSgH4JKAUDdQJ7N8+bntV5tvKvMMjnaL5T9HI9TodWZPDVjxjZlZAteyQACgfF/HvKXrK/r3v3XuiLfIbvf41zdibX6g7K7m2DgKrrrc+z+2d6bGq83FUbqyuQwU75/q/Ax7Zokq8tWq26aKmzk0ccMkoTHUyFClWrALbxuuym8g2693KFGhdJXQt3Er3RLpFSe4BzQV7VFO7qauQuSfcRNg3Pmzl3lC+ni3C2nsre5WMiFFkAivJTM2lF/RZ7dSWArLIdVYiOlDV/K/cm53el6J+M3e3bDuNVLubcuApuheuZIySPuDuTuSbbW5q6kv9JMZgclrFyobi7zb/NOSu1bJdXHozKII/wDeptLEf6VG6L4vbDb9tAl529xdk2sDjDDKdyuwfTwrATQq3ymuYacCR1ih2v8AOHsRhJuvsvpz464OVlkOF6i2vkO4t/pA4XXTS9h9nU+3tlUVVGpILxbPq1DfpYix91EHNF4a3F7bWcX8MKmaT7PEl0oD9kJ6u+5ezGwCm18ubtv96MeJfTJYWtR+IWtmZbhlPob9DTiB1A3b8Bel+zcJU4juLdnfnb1RVJKGy28O+uzMa9PPKrA1WN25sLPbL2Jipo2bUgpsRFGpA9NuPdbjlPbb6Jo9xuLu4J83nkH5hY2SMfkgHT+1++PN/Ll5HdcpbXse1IpHZBtlm9QPwvLcxXFy4PA652J9eigfyvPkD0N13sST4YZDunKZbvHYnefyA2VjOt98rn6rsOj2/g+y95VO2Y5jLR1EEuO/ubRQ1jVKypSRvK6jRYL7DvIu7bTZ2p5afcmbdIru4QRvqMgVZH0+XDQAa8Mnh1K/3k+ROd9/3pfd6Dk+OLky+2XbLh7u28IWrSyWluJiKMCH+oZowhBcgA549aIv/CwHsrN7w/mz1OysjI7YrqrobrDAbfhLjxw0+4oMju+uZEX9LSZDMOTfk2H4A9yT1iJ1dF/wiG642rF1H85u2jj6Kbe1Z2D1b1/HlvCv39DtakwG4M/Pi45r6xSZLLTxTOpFi1MhH0Pv3Xut7K3+93+n+v8A737917rv37r3XvfuvdfJt/4Vtf8Ab5Hsf/xC/TH/ALpsl7917oAvht/wo6/mRfBT487H+MfRGW6apusevv4sduxbo6yXO5xVzWTqcvWityozdF93/llW5UmMEKQtyAPfuvdXgfyi/wDhSz/M0+Zf8xz4tfGXubMdK1HV/bO9stgd4U+3esBhM3Jj6TZ2483B/DsqM7VmjmFdiornxtdCw9+691sMf8KuM9Hif5JXyYxr000z7n3p8ecNDNE6KlG9L3511uBqioDEPJFJBhGhAUE65FP0BPv3XutI3+Ql8bYfk58dv5zWwqeKOo3LL8Da6faSVFKtVBTZzHbmj3BT18UY/d+/i/gnji0kf508j37r3Qqf8JB/kFVdSfzVYur5aiGDBfIzp3e2xcj5pCmvLbXjg31t2KJDZWqJa3CvGv5s5A/UffuvdAl/MPrcn/NL/wCFE25us8NR1WZw29vlPsj4/wBFRQ1Jm0dfdc5PH7a3dWUjKwVIYNv4TJ1pCWvpJHJ9+690HP8AwpioKTEfzhfkrhsfCtPj8LjutMNQQL9IaHFbBwNBSRiwA9EFOo+nv3Xuvpy/yistjt4/ysPgbUxyyZDH1PxQ6jwU5qVkUyHD7NoduZClZZfX4YJ8fJCp+hRRbi3v3Xuvm5fz8P5GPfX8vb5Adkd3da7Dz29/hb2VvHK7m2dv7btJU5qHrGr3LWy5Gfr/ALBWljlqMFNQVdRImOrJ0WlraZQEcyRyKPde6KP/AC+f57n8xX+XKMNtzqLuKt3t09i5oA3SHa5qd47BioFqlqaqi24lXUjK7ParUFNeOnhRL/5s/T37r3X0k/5Lv89DoX+bjsTJYekxMfUfya2FiaSu7H6YyGUir46uidIoaneHXuTYQ1G4No/fsYn8kUdXSOVEyAOjN7r3V6gPv3Xuu/fuvde9+691737r3SA7X/5lb2V/4YG8v/edyPv3XuvhIdN9k13TXbXWfbWMxlHmsj1nvrau+6HEZCWeCgydXtbM0eap6CsmprVEVNVy0YR2T1BSSOffuvdbkn/Qbh8sfx8MOhbf+H3vo/8AxkPfuvdbOP8AID/nKdrfzgNi/IXd/Z/T2xOpJOnN27S23iKbZOezuaXMR7gw9Zk6qbIDNUsP27UzQIsZjY6gxuBYE+69181L+c5/29n/AJj3/i53yD5/8qRn/wDinv3XurHerv8AhVj/ADXeoOtdgdUbPzfQ0e0+tdm7b2JtqOv6iiqa5MDtXEUmExK1tTHuCnSpq1oaKMSS6FMj3Yi5Pv3XuthL/hPN/Py/mAfzJvnrV/H75K5fqis64g6Z31vMUuzevE2xlv49gajDLjpzlP4xXsaZI6uRXi0Wa4N+PfuvdV0f8LYdyUuS+bHxS25DJUtU7Z+Ouakq0lVxTJ/HN91dTAaZj6HZ46X9y30IF/fuvdVj/Or45pS/yM/5P3ydxtK9TUT7n+TnVm8cmVRY6OCt7Aqtw7Gx4bT5H8gx2XJubArx7917rZl/kYfzE06y/wCE33yr3jksiMlur4RYvuvb+NhyVXHaYblxE25uuMLSiRkKgTbhWlp4+A2gAG9/fuvda9H/AAm6+PtZ2X2b/MA+S2bxs2Vxvxz+B/f9XQ56sZ6gU3ZXbG0sxtbENPNKXd6+r20M5MrsSxaIm/1Pv3XuiKfyFc4Nv/zh/wCX5XyZP+E07fIHb+Pqqoz/AG8T02Ux2Wx70k7k6WirTUiIqeCXH5sffuvdbeH/AAtp7cy2I6A+HnSdKJUxG8+zN5b8yrqwEc9RtDBU2LxsMo1Xbwtn5XXi3N78D37r3VCX/CSDpvZ/av8AN02znt342kyh6b6V7L7Q2pBVRvJ9pvKmqNubVxWUhXSYhLjqDc9YyljdXZSouLr7r3X1fx9T/T/ieP8AiPfuvdd+/de68OP6n/X9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//1N/Gmqqatp4KujqIKukqYknpqqmljnp6iGRQ0c0E0TPHLFIpurKSCPp7qrKwDKwKngRwPV5I5IZHimjZJVNCCCCCOIIOQR6HrP7t1Toi28/nBiqnsve/R/xt6s3P8pO4esjRRdmYPZm59kbM2b1vW5FqlKTFbz3/AL5zWMoosu70kgkpcZS5WamdGSdYpBoIWueaIze3W17LYSX+4wU8VUZESMmtA8jsBXBwoYjgaHHU07P7NXUfLuzc5+4fMtty1ynuOo2klxDcXE92qU1Pb21tG7GMahR5nhVgQULKdXQd13cn80mskM2F+FPx5w1K0gMdLuP5V1WRyKQ3vaeTB9Zx0AlINro7gEH6i3tG25c9Max8s2arXg10Sf8AjMVOj+HlL7tUShLz3h3+aWmWi2UIlfl4l4Wp9oHTLXfJ3+ZRs1Y6jdn8uDb29qN6iOnaTqD5TbMyVdGZX0LOcXuza+CqTCv1Y3CqOWZR7affOdLahuOTElWv+g3SE/sdVPSyD23+7xu5ZNr+8HPZzBSaX2zXCKaeWuCaUV9PM+QPRrvj91tncPnu2+7d8bXj2P2L8g8zsncG5djxZug3MdlY3Y2wcJsjb22qzcWLjjxmaysQx9VWVU1LqpUlrTDE8qRCaQ/2iyljm3Dc7qDwry8ZGZNQbQEjVFUsME4JJGKtQE0qYw565hsruy5W5N2Xcje8v7DDcRQ3JjaH6h7m6kuJZlicl40OpI0V6OVjDsFLaFaPlfufGYfB7AxOer48ftir3jV713pJMQEq9ndN7U3B2xkMYAbeRsnmdqY+Bk/txO45+nsh55vYbe22uC5lCWTXBmmr5xWkT3LL/tniQU8wT1j7z7fQW9rtNvdShLFrkzTV84bOKS6Zf9s8Ua08wT1X12P8b5Jv5afUu9aLx0fZvS+2I+/dvZakJWpgp9y5OTsDceHWcMrBI8Zkopxb/lLx0RFhf3FW78oFvZ3Ytxiou87dD9bGw4gSN48i1/0rBv8ATRr1Em88mlvZbl/coqLve2wfXxuOIEjfUSJX5KwP+njXoPv5xXy7/me9SfHf4+5T+W58et19j7p7ex0ma7P7Q2b1wvcGZ6mxyYHbmRw2KxHXUcWSEuQ3dV5qotk6vH11FRxY94/H5p43jyB2y6N7t233jCjTQI5/2yhv8vWRm03P1+27ffSYaaCN6fN1Df5eqOugv5nH/CnTqqdt59s/CTt/5J9bY4mfcGA398Va/rfc32CnXVPt/Kdabf2tn6apiiB0yy4TLwR/VomF/a7owITyPV/3wv8A58H8vX5VZGi2luzdkHxL+TFVJFit19GfI6kXrrddFuFAIHw+L3rnKHEbZ3VqljCUsZqKXJSrpDUUT/tigRAxcINR4mmenHkuDEkLTM0C8FqSo+wVoPy6u6jeOVElidJY5EWSOSNldJI3UMjo6kqyOpuCDYj3bpP1z9+691737r3TVTYLB0WSrs1R4bFUmYyixrk8rS46kgyWRWIIsS11dFCtVVrGsahRIzWAFvp7bWKJXeVY1EjcSAKn7TxPSqS9vZreCzmu5XtIq6ELsUSvHSpNFrU1oB181P8A4WgfGvObJ+a/RvyapMVUHZndfUMGzq/NCniWnj331xkqyKfFyzxRqzzS7XyVHLH5GZyEkA9Kj250l6Tn/CQX+Y11t8W/kx278UO5914rZW0PlXR7Urdgbizk0FDiE7h2bLXUWHwGSytTJHT41N0YDN1UNO7kJJWRQxsRrBHuvdfTiVgwVlOpWAYMpDAgi4IIuCCP6e/de65f77/fH6e/de697917r5Nv/Ctr/t8j2P8A+IX6Y/8AdNkvfuvdbI/8g3+Sn/K5+Wn8rn49d6fIb4h7N7M7Z3c+9l3NvPLbu7Px1dlzjN3ZbH0Jlo9vb4w2KgFPQwRxgRwLcLc3JPv3Xur6ui/5Gv8AKk+NHbWye9OjPhzsnr3tnrnJzZnZO88bu/tXIV2Ayk+PrMVLV09HnN+5TEzu+PyE0dp6eVbOTa4BHuvdVW/8LENzxYP+U1S4V6urp33l8jeqsLFBTlhBXPj489uhoK0AhWgjjwLSrquPLGv5t7917qlr/hE1tjD7i7K/mCQZehFZT5HqPrTbFarl/FNh89n9zJk6F15jIqkpU+ouAv8AS/v3XuteDJ7jzP8AKM/nP7x3HW4CpqJfij8o985Ck2ziKsUMtZtmpqMxUbcx0FQwCIk22dwUhPBW304sffuvdW8/8JMeia75P/zaO1vlhuegbJ4zovZm/eynr6pw1TR9ldz5quwO3ajXo0ySNg6rOh9Njci3F/fuvdFF/wCFXGKx2K/nO98LjqOOjFfsTprJ1ojDj7nIV3XmFnq6t9ZN3qJTqNvTf6e/de6+hz/ILz8+5f5O3wIytVTx00o6YbFiKIlk8WA3nuvAU8xYm+qop8asjfgMx9+691bVlMXhtyYnIYbNY3G57BZmiqsblcTlKSkymIyuPqo3p63H5Ghq46iiraKpiZo5YpEZHUlWBBI9+691qQfz1/8AhOv8Dexfi9398sPj/sPbfxc716f2Fu3tirm2MI9u9Wb/AKTbGPfO5nB7i2RGRgcLX1uPx7w4+fFR0Sx1DKrxSB/T7r3Wkr/wnz7P3r1Z/OA+E+R2XVZGKXdfZknX+48fjpnh/jm0t24LK0OZxtaEV2loIykVW6WsWpVJIA9+6919l38nk/4D+lvr/r+/de679+691737r3XvfuvdIDtf/mVvZX/hgby/953I+/de6+Fx8ZNgbf7X+RfRfWG7fvjtbsLtrr/Zm4hjKhaTInC7j3RjcTkvsapkkFPV/aVb+N7EK1jb37r3X06z/wAI+f5QRNxQ/JJR/T/TOp/H9TtX8+/de6tn/ltfymvij/Ks252Ztb4sxdiR4vtjOYfcG6x2Du9d21H3+DoJcdQDGyri8Z9nAtPM2pSHLMb39+6918m3+c5f/h2j+Y//AOLm/IP/AN+Tn+f8PfuvdfRz+F3/AAn6/k6dm/ET4xdi72+Duws9vLfHQ3VO691Zyq3v3BFU5jcWd2VhslmcnPDQ9iUdHDLX5CoklZIoo40LWVQAPfuvdWWfFb+UF/Ld+EfaH+mf4s/FnaPUHZ/8Aym1v73YXc3Y2XrhgM2ac5TGCm3TvLO40Q1hpYyx8IkGgWYe/de6+fx/wsf3RLlf5qm2ttHJNVQ7T+NXW5jx3hVY8XJncpuavlAlCK0rVqxJIQWbSLWtf37r3VqW5PirTd7f8I3euIsHQ1uU3H01ioPkpt+mVfNUHJ4HtTctFu942RVaKjotl7xy89uQEhAP9R7r3Wn90N8263qj+Xn84fhcautp4PkvvDoDeeHNNHJ4vuutt1TVG56WWojYeBMngJI43VrrKsWn6ge/de63if8AhNL8Q6Hrb+Rd8r+590YrwZP5hUXdOUStRjFJkur+ttm53r7bUZkvrX7Xdq7msTYASXHBufde60fv5UOcg2P/ADS/hTmI6N6+nwvyh6+iipBL43mjfc0ePjBl0tYoswYm3NvfuvdbyH/C0r4+5fevw1+PHyBw2Lqa+Dpjt6u25umqp6eSVcVguw8MIKGuqpUbTBSNm8RFASwsZJkFxfn3XutRz/hOj819kfBb+aV0z2J2jl6HbnWHZeI3D0ZvrdGUlkixm1cb2C2MkxO469kOiOiodz4ShSeZwUgp5pJW9Kn37r3X2HqKrpMhSUlfj6qmrqCtpoayiraOeOppKyjqYlmpqqkqYXkhqKaohdXR1ZldSCDa3v3XupN/wAT7917r1/pcfX/ff0t7917rv37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//1bG/gF1f2x1F3z2f8IMn8rO5fip8m9hZysyvW0UU2K7C+PPd2z46Q1lMafqXfdP/AAuPJS4yMZOllx1VSy1mNnmUhKihmDY+8pWO4bfut9yxJv8Ac2G9wsTHwkt5kpXET4rTuGkglSfNT11N98+ZeV+auSOW/ea29sNo5n9ub6BUuyQ9rum3TltJrfWx1lA58F1lR1jlVDmOZCLnqvtD+aB0hFbfHx76V+X+3KSIhtz9Bb6q+n+w5olbSKnIdcdmR5XA1lcy2ZosbldB/sge5Je+552sf41s9tuMA/FBIYZPtMclVJ+Sv1iFFy3923nNq7Lz5vHKl+5/sdztlv7UH0S7s9Eqr6NNDX16L31b1X3R3B/MJ6w+Y2zPi/2J8PcDQ7I3ntL5NL2plNh0r9zwZHH6NoU2F2rsfcedr8tnaPLLFNV5OvipIfFRUrBnljCOUWNhuW483WPMdtsc23RCJ0ufFKDxgR2aVRmJYGhLNQUVeJGR5zLzNyfyn7Dcye0u7+5FhzZfPeW8+0fRJcsNvKt+uZJriKNUiZKqkMRdqySCgVqi8P3KHWGfXvfuvde9+690QT+Yz0VvDu7oUnrynq8hvTYGbO6qDCUDutduPC1GHyeB3RgaFEK/c1lZh8o8kcBP+U+EwgFpAPcW+7fLF/zJyv8A7qlZtxtZPFVF+KRCrJIg9SUYkL+Kmnieoo94eVtx5m5UP7oRn3K0l8VUX4pEKMkqL6koxIX8VNPEjqtbrX5GdgfIroPrv4F4Hb+bo+xcnmaPr/f27Z4WhocJ0htiopqvJVtckhSvoc1T4mBcbVQyxopjh0hmlqljWH9n5t3Xm3lfafa+1tJV3Z5FgnlIoqWcZBYsPiDhR4bAgYHmXAEL7Nzju3OHKmz+1VpZyrvDyLbzykUVLKMgsWr3K4QeGwIGBxLOANhXF42jw2Mx2Hx8QgoMVQUeNoYRyIaOhp46WmiB4uI4YlH+w95WwQx28MVvEKRIoUD0CigH7B1l1BDHbQQ28S0ijQKo9AooB+wdT/bvTvRCfm9/LN+GP8wjaFZtv5KdNbd3Dnzj5qLb/amDpaXb3bezZGiMVPVbd33RU/8AFDFRtZhQ1v3mLlIAmppF9Pv3WwxXgeteX+Rd2b8o/iz/ADMPlx/KB3j2zmfkl8ePj/tfc+4tjbyylTNlJurnweW2O+36OkrJ6rISbcxe58NvxaPJbe+4lpMbn6KT7IRp9wJPdXahUGlD1uIe/dN9e9+691737r3Vcv8ANJ/lu9R/zRvibvH41dnztt/KTyJubq/sSkpY6rK9c9i4uGUYTcFNE5V6rGzeRqbI0odPuqKWRLhtJHuvdfI6+e38rf5r/wAtXsvKbP8AkP1PuTD4THZCV9p9w7Zo67LdYbvx9PVRJQZ3b+8KGE02PkmlmjApqw0tbDNdTHwGPuvdGo+Nf/Ci/wDm6/FjYuP636++U+T3LtHC0VNjMDQdtbV2x2rU4LGUcccVLjsVlN543J5Ono6eOOyIZn0jgccD3XujRdR/8KYf5rXaPyl+NFZ3H8lcgOt8T3j1hVb02V13snbGyMVu/babloqPLYHO0O0sHHW5jGZShqpFnp1DGbiwLAD37r3X1kYnEsUcg+kkaOPr9HUN+efz7917r5OH/Cthlb+cl2SAykp0x0wrhSGKN/BMg2lgD6WKsDY/gg+/de63jf8AhL/Ij/yYfizodH01HY8baGDaXTfWbDo2knS6EWIPI9+691sDe/de604f+Fq24/4d/Lp+Oe3oq+lhqNx/MDb7T4+QK1XWYzD9R9r1k9RTgjUkVFkXpBI6kG8qr9G9+690Sr/hEBh6xaT56Z8imOPmn6dxSss0bVa1cK7uq3SSnC+WOFoZgVYnSxBAHB9+691VP/wr7+OS9P8A80qDtjFYf+HYD5I9P7V3o1UkJVMpvHaUlRtHdlT5baZpVpqXHF/qy6hfjT7917rZa/4RxfGEdVfy79+fIHL4aKm3D8k+3srV43KPForanYvXtMm2cRTlyA7UX8fXIzR/gmUkf1Puvdat3/CuiPR/OS7DJQIZukujJg2kK0y/3OjhWX6AsNcDJf8A2gj8e/de63YP+E8XZNNg/wDhPx8YN7Ry1+7Knrvrb5HzZDG4dZspmJKva/eHc+RptvUlNTRzzz5FMatNDDBGruNSIATx7917r55XV388j+al8ROy+xV6r+S3Z21sRkuwN7bim6p7Qo13jtzA1+5tw1mZq4G2bv8Ao69sNVRGoCmIJF41AXSLAe/de6g/M3+ff/NE+e3VU3R/f3yASo6wylRHLuDaXXmzNrdbUe7kiminpsfup9oY3HVeexkFTCkiUsztCXUEq3v3Xur4f+EqH8mHvDPfJDa/8xj5C7B3B1v1H1HRZeo6Jxu7sZW4PcPZHYOWpKzAf3qx2Jrftq+n2jtfF1FUFqJ4QlfUVEZgJSMufde6+kJb37r3Xvfuvde9+691737r3SA7X/5lb2V/4YG8f/edyPv3Xuvh2/Bv/ss34p/+LC9Q/wDvd4P37r3X3Uffuvde9+6918Tj+c5/29o/mPf+Lm/IP/35Gf8AfuvdWG9Xf8Kp/wCbb0/1tsHqjZm+Olodo9bbO25sbbEOQ6V21X10WA2tiaXC4iKrrZJVkq6iKgo41eRhqdhc8n37r3VhH8u7/hT7/Na+Sfzj+LvRHZm9em6zr7tXt/auzd4UeI6b25icnUYPL1fhrEosnTyPUUNTo/TIvIPv3XuiO/8ACtjPPm/5ynZsLGkK4HpnpTAx/aSrMQlPt+rriKvTI/iqxLkGDIbFRpuPfuvdb8H8pHpSg7I/kYfGvovduMOEw/bXxEy+xM1TtTwhlw3ZW3c9h6qvEEMhR3noM0Z1uQxJubH37r3XyEN69XZzavde6empqSel3Dguzcv1waKZHephylDuafbkcEkSjytMKhACoGonj6+/de6+138c/jdh/jF/Ls6x+Ma4egSm6t+LlBsXcOMghE1DkdzQbBkbfNX4UaQSrnd21VdUuASGac29+6918cT4q5Wfaf8AMJ6CymMqUw0mJ+W3XwpqgKsUVFEO18bSlbP6Y40gcpY8KPfuvdfae+Vvxn6v+Y3x47Z+M/cmKXL9edu7RyO1c4iLGa3GS1KrNis/ipJLinzO3stDBW0kn9meBb3Fwfde6+O//NC/lDfLP+Vp2/n9mdw7Ly24epJ8xVx9Z/IDbuJrajrnfuAeZP4TNPkY1qItrbmeCoRKnFVzxzx1KyLCZ40Ere690af4Hf8ACk3+Zt8DdjYTqbbHYe3e5uo9tQLSbb2N3bhpd1PtvHxQxwUuIwG7KeroN1Y7CUioTHRiqeFCx0hRx7917o6vZf8Awse/mlbwwJxWx9r/AB16nyjGUSbkwOwshuavEcoCqIqTeWbzWKikhF9D+FuTcg29+6919Hj4J/IBPlV8N/jL8ifuYq2q7d6Z2LvHK1kH2whqM/XYOli3FLHHR/5NAr52nqD40sIv0fgj37r3Rsffuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9bbH/mMfAGm+Xm2Nu9g9ZZsdb/KnpySPOdN9m0VRLi55anHVX8WpdpZ/J0iNVQ4qbJxiaiqwskmLrWMqq0UlTDMCecuUl5hghu7GXwN+tu6GUYyDUIxGaVyD+E5GCQci/YD30k9qdyv9h5jsv3j7ZbuDHf2bAOAHXQ08SMdJcIdMiGgmj7SQyxuiU+Af8w6furI1/xk+UGHPTvzV6zDYfduyM/TxYSm7KjxsKlt4bIRmFHUVlbSqKmrx9M8kfjb7uiMtE94U/KXOB3N32TfY/puZoMOjdviU/GnlUjJUf6ZaqcGfvl7CJyfbwe43ttd/vb2e3H9SC4iJkNoXP8AYXB+IKrdiSuAajwpgswo9rnsfdYw9e9+691737r3XvfuvdYKqqpaKCWqramnpKWBC81TVTR08EKLyXlmlZI40A+pJA9+691VL8oe9/it0t8hvj1383ffQe0M3HvGq6j7bhrO1NgYWryWwd/42sio85uOmlztPM9Ns/c1FTTPUzLaGOW7sERdMc8y7S9lzXylzVtloxuDcG1udCkloJ1NHk0jhFIqkseAOTQDqNeZ9mksubuT+bdqsmNybk2l14aEl4J1NHk0jhDIqkseAOTQCi73T/OL/lW7N8wz/wDMD+KMTQBy8eN7k2fuCVvGCWWGLb+RyklRIdPpWMMzHgAkj3I3UmaW9Oir7i/4UEfCjM1su3/i3sP5YfOTdzgxY7D/ABd+NPZm5sRVVhYpFFPvHdmI2ftympXfgzxzTooNwD791vQfPA6BrdnZP8/L56UM+2em+iur/wCVB05uCF6Wv7V7w3lQ9ufJ7+E1CGGqk2tsfaNNNhNl5iSCQmMV0NPVQSWMVbE6hx7r3YOJqerCv5av8sTpX+Wx1ruXBbLzW4O1O5e08x/ervj5D7/P3HYXbO6mmq6oT10slVkJcTt6hq8hUy0tAKmoYTVM09RPU1U0s7+60zaj8urKffuq9e9+691737r3XvfuvdJndmy9o79wlXtrfO19vbx27XrorcFufDY/O4mqW4IWfH5OnqaWUAj8qfp7917qtvfn8k3+VH2ZnZdyby+CXx8yeYn1+Wph2VSYxG8j+R/8mxb0dKNTm/CD37r3Q0dJ/wAtP4C/HR6efpj4j9EbFrKT7Q0uSx3X2BqcpTNQD/JZKfJ5GlrK2CWL660cMSASSQPfuvdHi/1v9bj/AG3+8e/de6LP2X8Mvib3Nu2q372z8cemuxt6V1HQ46r3TvPr/bm4c7U0ONWRMfSTZLJUNRVSU9GkzCNS1kDG3v3Xuhg6661696i2ljdhdXbL211/svC+f+FbV2jh6LBYLHCpmeoqDR4zHwwUsHmndnbSo1Mbn37r3S3DA/Qgj+oII/P/ABI9+690EfbnQXSffuMxWF7s6p2F2ticFXvlcNjd/bYxO56LF5KSmko5K6hpsrTVMVNUvSzPGXUBirEXt7917qP1F8eOiegabMUfSPUXXnU9LuGopqnO02wdqYfbEWXqKSNo6WXIJiaWmWqkgjkYIWvpBNvqffuvdKTenVHV/Y1RQVXYPXWx98VWKiqIMXUbu2rhNwz46CraN6mGhly1DVvTRVDwqXVCocqL3sPfuvdKTbm2dt7Ow9Ft7aeBw22Nv45GjoMLgMdR4jEUUbs0rrSY+ghp6SnVpGLEIgBJJPPv3XugN7S+IPxY7v3Iu8+4Pj31B2duwUFPixuTe+wtu7jzP8NpCxpaH+I5OhqKj7am1HQmrStza1/fuvdCn1x1h110/tHH7A6s2Rtfr3ZOKetkxm1Nn4WhwOAoJMhVS1tdJS4vHwwUkLVdZUPLIQo1u5JuST7917otXe/8uz4M/Jw1c3fHxV6S7Hra5pnrMrndhYQ5mqeoUJNJUZikpabJzySWHqeQtcX9+690GPT38ob+WX0Lm03J1T8J/j/tfORy+aHJDYeKytTTTAqVlpzmI8ikEqFBpZQGX8H37r3VjNPBT0kENLTQw01PTxpDBTwRJDBDFGAkcUMUYWOOJFACqoAA49+691m9+691737r3Xvfuvde9+691BymMoc1jMjh8pTR1mNy1DV43IUkt/HVUNdTyUtXTyWIOiaCVlNiDY+/de6qC2t/ID/lBbL3Nt7eO2fhD1bi9x7UzeK3Ht/Jwzbnklx2awtbDkcXXxJPnpIWlo66mSRdSsNSi49+691cVf8A1/8Abf74+/de69f/AF7f77/Y+/de6qV7U/kWfyou7Oy9+dwdo/DXrXd3Y/Z27M7vnfW6chPuVK7cO69y5CfKZzM1i02cgp1qslkamSWTQiqXckD37r3SB/6B3f5Mw/7kS6p/H/KTuu3P/kw+/de6XXWf8ib+U5072Ds7tPrf4YdZbX37sDcGN3VtDcdHLuOWrwm4MRUJV4zJ0qVWcngNTR1MauhZGAYA29+690q/kB/Jf/lj/KXtbdHd/fXxJ687E7T3pJRybn3jl5dwRZLMS0FFDj6SWqFBmaSmMkNFTpGGCAlUH9PfuvdWBdVdW7B6P632V1F1XtnH7M646729jdqbL2rivIuN2/t7ExCnx+MovPJLMKemgUKupibfk+/de6KxlP5ZnwBzXZ9T3PlfiP0fkO0q7djb6q97VWxsVLnKjd7VgrzuCWqaH15Fq5RKXIvr5+vv3XujxVNNBW01RSVUSzU1XBLTVEMguksE8bRzRuPqVkjcqf8AD37r3VPtH/IG/lDY3dlHvig+EfV9LujH7kp93UeWhn3Qk1PuCkyqZqmr4oxnTAGiyUYkCaPGANOnTx7917q4ix55PP8AvH+t/Tj37r3SP3117sTtHbVfs3sjZ22N+7Syi6Mjtvd2Dxu4cJWizBTPjcpT1VLIyK50sVuL8H37r3VK/af/AAmx/k5dq182UrPiPt7ZeRqa6bIVk/XW4tzbShqpqh3klSSgococdFC0jltMUUfP+Hv3XuonWn/Cab+Td1pVrXxfEnCb1q4qsVkD9hbm3Tumnp2XxlI1x9VlY6CaFGjuFljfkn37r3V2+xNibM6w2ftzr7rza+D2XsfaGLpsJtjam2sdT4nB4DEUaFKXH43HUaR09LSwqTZVUC5J+pJ9+690rffuvdev9P8AH37r3Xr/AO++n+9+/de66uOP8fp/j7917rv/AH3++/1/fuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//19/j37r3RF/md8AemPmdiMVX7kbJ9e9xbOMdT1t3psVhjd/7NrqWU1VDG9XBJSvncHBXWm+zmlRopLvTTU0rGT2FuZeUtt5kjjebVDuUf9nOmJEIyM41LXNCccVKnPU0+0Pvpzf7Q3d1Bt4jv+Uruou9tue+1uFI0sdJDeHIV7fEUEMKLIsiAL0RjaHyF/mh/DbIJ118kfjduH5tda4sLT7f7/8Aj6kVX2DWYiHQkM+7dolPNkspBTx/u/cU+PlaS5arqyfKwVtt4565bf6Petlfc7JfhuLfMhH9NPM041Cn+k3Hqat15D+7Z7uQNzB7e+4VvydzFLmXbN0qtqsh4iCfgiEnt0tKtMCKL4QdDov+Y30x3f21gui5dhd/9Ndq7o27mty7Z2p3t1Fmuu5tyUO24mqM+mBrp6ivochLi6aOSVyHWNkjbSxYafYm2rnLbd03CLazaXdtfujMqzwtHqC/FpOQaDP5dQ/zp93/AJv5M5WvedV3zYt35YtriOGabbb6O6ELSmkXiKArKHJAGCQSKgA16OV2TvvDdW9db+7N3FFXz7f652VunfedgxVN97lJsNtDBV+4MnFjaPXH93XyUWPcQxal8khC3F7+xb1BnWsh8Le7fn9/Pc23vnvzbfzNh/l9fEnBdhZbYO3ukPjFidr7q+UeTjxMNBXrlOze5N3UVYNg1GYxuUR6Q4nHotQFZ0hEYjnl904QExSp6P1jv5BvwHy9T/E++qn5O/LjOyESVeZ+Tnys7w36ayosS002Ew+7tqbXUFzcIlCsY+mm1x791XUekn8j/wCUv/LN6a6z2avV/wAF/jdgtyZ7vHo/auNyB60wmbzNQmY7IwIytA2Tz0OVyNTT5HDQVMdTG8jrNAzhwwv7A/P97d2ezWAsLmSK7m3KziBRirEPcJqWo4hkDBhwIrXoB+4e4X1lsu3jb7uSK7m3SyiUoxViHuI9a44qyBgw4Fa16s+2v8Lfh1siaKo2b8T/AI17UqYNPhqtudGdYYWqj0fpK1OO2vTzgr+Dqv7HHQ7qfXoxlBj6DFUsVDjKGjx1DTqEgo6Cmho6WFAAAsVPTpHDGoA+gAHv3Wupnv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6qF6Px+R+avdny13B2/3H3fs6L4+fJLdvRPX3SXUneHZHRmI2rtLr+SjGK31u6n6q3Rs/Lb9ru3o5Uy8T5ySupoKKVYaVUiLL7917pMdgfzPc9sjurf2ydtUGxu2Ovo+vPlNWbK3btTCbyxmO2l2z8V9tVGf3L15vXeGZycmE35UZOSiqqKtbCU1KMFkKGSnmknkkPi917rNtP8AmRdl4L+8OL+RWL6a6nrM98KdqfNLYG8MdWbu3NsnY2B3LujanX8nX3ZEVHM+d3buCm3dvGgekqcLHSx5GGc08cSTJrf3XuoPT38x7vLvDKUnQe2evNkbW+SGN767d6a3fuzf+I3Tt/q2lwfT+29vburN/wCK2FLuD++hrN2Y3ddFBR4CfMLW05MlTJK0aeP37r3RZfiX8xN09V7dbKdzbqwe2KpaD51by3fvDcvYu+91dU7Ny20/mDk9jYHHpt7D5Babd2NSszsNJQTRUj5YxGGjhkRBx7r3RidlfzJ+/wDf2H2dsrb3V2wk7iyfzj3H8MM1m92Qbn2TsmooKXozcncuF7pxWy67LZHduLoFx1HSyPtyqyElfWRRSRJUwPURPF7r3Su7G+WXYvcv8rn5P9vQw5PrDuDrKv8AkJ0puOr6x3JlsRPF2N0H2ruTqDdOf633FT1NPn8Lj9w5na09VinacVlNDUIryF1LH3Xuga/2bPePxW6t+Pux9j7D7woO2/kglZXQZP5gdmd0/ImHF03X3V1DurMZfHUdTvvd266g7uyUox0VDjq6hSnqKj76eJoozGfde6T3yg+dXyT7y+HfzOx/W/VmE6Lz/VX8vTtXs7uTG9q5jPYrsGg3Xu/qPslaTAdYTYebGzYNdrQ4ZcvS7iq4aunr5DHRxw08oepj917pf9afzHu0j2PsDp3YvVcvYmyutct0J0V2WYsPu7I9mZfL7u2Jg63ePcWPzsfi2hhNk9ZVEwNbR1y1Fbm4WNRTTxLZD7r3SkT+Yp3rkfjce5pcb0hszfO/+yu6dt9A9UTYnsTsfdXY23vj9vPfezt4JNjdrZXDtRZXcMuy/uYq9po8dhKepjNX5nZUPuvdAfmfnr8l+0txdhdh4rNbN2/8Y8t/LRw3yo2/0/R47dm2e58FvTK7vn25V0tV3RtjdeLqqKqpMljpolnoYoYvtbDxrKfMPde6MBQ/zHO0lx2R7SoOv9lS/H3q3uTqL42b+xuVzWafuXcG7+xY9g4+s7D2zU1WQfH0m3drZXfMEf8ACq+lqspmYoZKiOpi9Kt7r3Sg6b/mAd5bx7f6zpN99a9b4jpfuLv75L/G/aUm283mK7sPC7o6A3XmMLiN9Z6SqqDh6vb3YNFgqvXjIaaKrwssUbSVFQJtEfuvdW/Cw4H+P+8cH/D37r3Xfv3Xuve/de697917qNWO0dHVyIdLx007o3+pZImZT/sCPfuvda5fx++dGe6X+L3aXy17px/zC3puLC7u7W2LQ5PsfNTxfH/eebz3y83D071vQ9eUlNXZ+HFLgaRMbDNVJiC8GOpaqQJI7FH917oePjH/ADFN+7mwHXnS2E663B218lN2dv8AYu1M1l98b0zG2eu8thdqbdn7D3F2HtfemY68wyVm1aXEuuKx2MxmEiSGsjVHCAtI3uvdEbwX8zvtTYXxi2J17uafsbM987m3l37252A8nYGay+68H1r1p3dlsfSdQ7M3lBsbfE2fz+8qKjGKxiww4wQUBvDNC+nR7r3VrdN/MUz2S3b3vTY3p3Dbb6r6E6u6l3zm+z+1+zo9gxzZ3unrrr3sDZWxK3AVG2sznsdmIaPddZDXu6Syx1FNTQpDLLWAR+690XXaH80vuDvzfPw2xXRnXGwqbD9j/MX5G/E75A0+4dz5SWKHcfTHxc3735jqzrHMVm3MPkMhgMli8LBXmsqsbTSCen+waMLN9x7917pXdZ/zH+ytwYTJbS6w6eynd3YOxNvd5dsdoDf3Z22dh1mF6z2H3Z2B1nt1sHW43ZkmF3Dmdy1Oxq4UdGsVKtDTwR/czM7hm917qT2J/NtyW2KLsPfuzfjvV706W6m6Q+O3yA39vWr7Fx+2twUWx++Gq4p8bg9ny4DJz5vdmz3p9U1M9RSw1AV1WZX0B/de6Ox3V8ps1szsDoLp3qPriDs/tbv7bm+excDhNwbui6/wWG6u6wh2S2+Ny5PcE2IzxkytNkeyMFR0uPip3lmatkmJEdPIG917qmrpz+bZvXo/qDYmz+wtkbk7S7v3DQ989zbyw28Owdy5fI7a2TtbuzNbAw/X+2NxYrZu8ZN4bvqKyn8WOpGjoKOKiVH8nPjHuvdWs9HfOym7q+TO6+gz14/W1JiuuNl9l7Ln7Iz822ezOzdp712PsrelNu7aHWNZgFNXszC1e7KjA5OoGTatx2ew9ZT1FLGqxySe690TWX+Zq++fnFj+udi4Ddma2LtPtfe/xRx2CweVz0DZTvyPBnI12/8AsfblHsGShTqTbLxx4372TPSCjnqRWCmLhV9+690JHwW/mA93dyUXxr2f371ts7Hb/wC9+uPkF2cdxbA3G1Vt3G4fp/safZ2Lx/8ADKikWoaqy9Oy63WQrG0fNy3HuvdJHM/zJO0+8ug89P0H0RNPvqr+Ee4Pkxvuar7ZotlSdZYrdydq7T6+xuzs8mCyU24d6vmet6+vaVEpYaCKGnJkMlQnj917pI9DfP7deyOu93R70z026NwdefFT+XFu6LIdzb/p8Rgc7u35KbG7dr8omJqsPtHcW+81vGWq2H5sjHOclUZJwrQGBIpWb3XuhEoP5rm7Ow9kdAbi6O+Nyb4zndXUHyA7Ry2L3F2fS7Mw+xan435Ztv76wAzVbtaep3Icpm4ZIcVUCkoRNHpmlWFdSr7r3UXbf8xzv7c3aPZm69rdE0u+vjvtr4R9e/J7amy9qZF6vvzN7o3jG4faMGG8BoKpoMnTVkErqbJTUfmjWV5UiPuvdGNk/mIbIwvwErPnVuKg2xlsJSY/CRLtnrPek++cZLvDeG+sF1rs/aNRuRttYfIY6vl3ruigosos2KFRimeUtBIYtLe690S7dH81bvPd+z+t6jqDpzamL3dT/Pv4tfGDs+q3Hl9zzdb7m2D35Pi6tMv1Tu7N7L2tWZrNfb5aOhyK/YOMHXJKjNOyD37r3VhPyA+TvYWxuyNifH/qzqel7G7b3v1B2J3BnlyG/qfr/bWz9k7Bm25t/JVNLuKowubnym4sluvd9HTUFNHToBEstRK6JHZvde6qH6Q/m/57pn49fH3Zu8tk7s7q7Wj6bbtnuWs3JvLdWY31FTbg7qzWzKLZu0ajH7L3hJ2TvjF453qQk1Tjqc46hGlwXVE917q2ToD5sTd2/JfvD4+ZPr2k6zq+paeiyWFo947teh7Q33tXJw4+pxPYuK63qNvUjL15mI6/RDXQ5CpeGoTxVEcUjBffuvdH49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//0N/j37r3XvfuvdITsnsfavVGz8nvbeFZPTYnHPQ0kFNQUk+TzWczWXrYMVgNtbcw9Ir1ub3LuPMVcNHQUcKtLUVMyIo5uEl7ewWFu9zcMRGtBQCpZiaKqgZZmJAVRkk06O+XuX9z5o3a32baYla6kDMSzBI440UvLNLI1FjhijVpJZGIVEUk9A9gNgQZzs/bXyJ7fx+N2/vzF7Ty+xeq9mVNZj6+frrCbxq8bkt1RzZOmeWHOdhbtOGoYsg1E8lHQ01GKWkaZWqaurLobQS30G8biipdrGUiQkHw1cgtn8Uj0UNpqqgaVr3Mwrvt9ksuW9x5A5Unkn2SW6S5vbgKyi7kgV0gohoY7WDxJGiEgEkjyGWUIRHFEZaop6esp56SrghqqWqhlp6mmqIknp6innRopoJ4ZVaOaGaNirKwKspIIt7POo561PvkH/wnp766D7y3D8o/5Mfyvrfiju3cdZU5PPdEbmymYoOtZ3lqZK+TC7ezOOxu58fVbQkrJnNPt/ceDy1DQ6iKepgiCRR+6cElRRhXowXVPa//AAp92tiqfAdk/FP+X12rVYseKbe2S7gyewctuRQ1hUS0mzstk8HTTMvJMeIoUP4iX6e/daOj1PUvevy1/m05LtDr/E9v/wApvb3YS9D1uP7l3Htz42fMTrjcVXkslmqHdO1evsiMf2BgtqSCTFVVLlayPHCaWpmkhgkLRov7gU3K1s973/arR7w69tZbt4tBIZnWSKAl60GgiRwlCSQpwBkI7pZ7fvvMW0Wb3x17Wy3jw6CQzOssVuxkrpGgiVwlCxIU4AyJtJ/woV+KHX27sT1780+jfl/8A96ZaQQ0/wDsynReap9lVMmkEvi98bDqd3UWVol5ZqlIFgSMa2ZVuQK+hbpPkQervOvuw9ids7J2x2T1ju/bm/8Ar/emIpc9tPeW0cvRZ7bm4cPWKWp8hictjpqijrKd7FSUYlXVlazKQPdV4Y6WPv3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6Kf2P8I/jP2p2RP27uzryoj7GyNBj8Tn9z7U3lvvYlXuvF4gs2Not2QbJ3LgKHcf2TaPFPVxS1UccaRLKIh4z7r3Seq/gd8N8VndzdhZDqfB4+uy6dsVmcr8huvd8O28bF3XHlm7hqcdga3c/wDdLa0e/ps5XVOVkoqSl+4qquaoYiV2c+690oNxfD34o9jUVC+d6121uGhremMN0Riaqmzmah83T2A3FgN74Ha+HyeHzlLVR02J3FtbH19NWUsq1kUtKjrMAD7917pOxfy/Ph7HgKraMPUsEVJVdr5DvisrIt89hx7un7ZzeLhwWV37UbxTd43i+Uy2KpY6adWrftpoowpiNvfuvdZ4/wCXz8OafZ0ewIOjNuR7Qiwu7NvQYZMluUCmxe9990vZm50pMh/HDlaWsyO/qKLKiqjqEqoapAYpEX0+/de6fuvPhz8WNhjD1OweucRBNtntyv7qoMmdy7n3Nk4u4ajaeQ2Fkt51+Yzm4Mxkq/PvtPLTUEgqZpEWFwNAKqR7r3S1p/jL0bSdZb76bp+vcSnWnZu7Owd8b72oKjJfY7g3V2nu/Kb939mKqU1xrI6jcm7szU1sqxSIiySkIEWyj3Xuuuy/j70h3Lgtr7G3xtyHKQdbSUOQ2cmF3RuLa26NkzLip8HRVmGz+083htz4pajE66c2qBFVRArIJALe/de6C3tT4K/EDvKZMV2f1nRbwq6Xq1un8pSVO/d/U2SzvU1WKpRs3erYvd9FkN34F3qpWjOWarkDu+mQa3De690v6X4n9EY/sTGdqYnZ9bg96Yyi21QCswO8974TF5Gm2di4sLtVc7tnF7ipds7gfCYuBYIWraSZmjAWQuAAPde6Sm5/hZ8T8nszZu0dw9Z4mg2p1zlt+ZTZ4o91bt2nNgqztvPZPN9g00efwO5cNlp8ZvjPZ2eatoJ6mSjqZXQGEmOIJ7r3XAfBH4oJT4Ckg6hxNJSba6Yyfx3xdHSZnc9PSN0jlckMzVddZGlizYp8xg48yiVcD1SzVcE8YaOZbuG917pxm+E3xdm7Hw3bE3U2Kk3xgqnbORoq05ndK4efMbLxUWE2luHL7QXODZ+f3Nt3FwJFS5KtoKiui0Iwl1xxsvuvdKrE/F3oXAS7PnxPXWJopthdib67W2jIlVlWbC9hdl1+Sym+NzU5krZPLW7grsvUyzLLriVpToVRa3uvdD+Bzf8AP/Ef7C4Pv3Xuu/fuvde9+691737r3WOWNZopIXvoljeN7Gx0upVrH8Gx9+690Wmm+IfRsHQL/GiXbVbW9VHN57c9PjanM5CPL4/cue7GyvbBz+NztDLR5Ggy2I39l5MhQTRMrU0kcdrhefde6R+d+FWy91bP6+wm6u1u+txb76p3Rl919c975LfmMHdu0azcFLHitw47G7ootrUeFmwWe2+GxtXS1GLnjmpJG1fvaZl917pI4n+XT8edibV2Jgepsl2h0dXdcT7oXb2++tOw67G73fDb63I+7t67Zz2c3JTblptw4Lc+5ZTVzLWU81TTyn/JJqYEj37r3Qgb8+E3RfY6d0yblx+4pMl3xl+rtzbzzlHn5KbL0m7umMNg8N1pu7blR9vJDi89tddu0lTE7xzQvVRa5I3BK+/de6ReG/l4dA7dpMPLg6zsnH7xwfyPzvyvpOzhvWWt7Ek7q3jsletd/biqs1ksfXUdRSb967lqsLkqM0ggOOrZo6cU/wC00XuvdRcn/Li+OFZicZicUnYGzxSz9h02byGzt61eCy2+Nm9rbvy2+t/9Z72rYqWV8zsHP7kzVRP9sohq6Qv/AJLUwsWJ917pU7x+BPxs3tt/uDa2U2pkaTbvd3V/WnT29MPiM1UUNJH1/wBRRfb7FwuDQrM2KGJpwIy4LtIqi/v3Xul/3B8YevO46Lrlshk96bJ3X1JUNL1v2T1xuFdtdgbUpauhpMZncRRZmegydHVYPdOKoYqfJUdVSzwVCxxvpWaKKRPde6Brb/8ALr+P+wMJsbE9PZDtLpHIdepncbgd3dZdg19Du+o2hufd1RvvcmwtwZfclLuZNx7Qze7Kp6546yKargnN6eoh9+690LtF8V+vE7+p/kfncxvre2/sHh8phNhUm8twwZfbHVtPuPHYPF7xn67xkeLpKvCVO9KTbVEMn5ampimeHWiRs8hb3XuuO3vi3snZnbmX7Y2Nu7szZEW6MtV7k3p1XtrdkVL0/vPeWQg+2rd6ZzZtXiq6eDcdbAqCoegrKKnq2ijkqIZZFD+/de6A+D+Wp8fsbt7am3tt57t7aA693tvzdXXGc2xv1cduLYG3+z5aqff3U+2sq+GqZB1TuWaumeXG1i1dRDJJrgqYnVGX3XuvV38s/wCLU+zdi7C2rR782BtXYnVNf8fXoNgb/wAriZt5dFVdRnaiq6c35k6kZPJZ7aUOT3DXVEZWanylPUVEpjq0Ekit7r3ThXfy3PjRJUwZTAUW99j7jxON+PGM2lurZ+76jHbi2LF8YNtdhbK6nn2pW1tJkoqWsoNl9p53FVctRHVGrpK5r2lVZV917pVbI+Bfx169g2dTbZwO4KeHYu1u7dnbe+/3RkcrUR4T5A52bcnZUdbW5H7mvydXk8tUPJFPPK8sVzdm+vv3XusWJ+CfT+1cntfNdf7i7R62yu1ekH6Ap6/ZG8YcbUZTYdNWfxHbMuakrcNkfu9xbHyby1GJrU8RheZ1lWaMhB7r3Sq2f8N+htndEbk+Pf8Ad2s3HsPemUym6N+1+5cnJLuveu+Mxm4Nz5PsXPbgxMWGkh3zNuejhyaZGhjo5KavgjngETopHuvdMWb+GGwt69S0fVe/ezu7uxosL2JtPtfZHYe8d94/L9k9f762JmKXPbGz2z9ww7cpcbBPtbI0aPTfd0NYJDfz+YsT7917pVd2fFDrfvav2LuLcWY37tfffXlBl8Bguxtgbn/u1vWXaG6IKGn3tsrK5A4+uoMhtje8eMpjkYTSrN5KeOWnlp5ED+/de6DXA/y+uiuv6Tqqk6aynaPRb9SbcpNjYas6s35VYyt3H11R7kqN3RbA3zLuGi3Mm59vncNVLOZpUXKKJXjWsWN2Q+690Ke2/i11xt/v3M/JOtyO8d4doVm2spsrbFdvLN0uWx/WmytwZSizm5Npde01Pi8fVYrBbhzeNp6qqjq565/LAgjeNBo9+690ZO//ABX37r3XDyR6/HrTyadfj1DXouF1aL6tOogXta59+691z9+691737r3Xvfuvde9+691737r3Xvfuvdf/0d/j37r3XvfuvdFo+UPxi258pto7O2tn9+dm9bVOw+x9udo7Y3b1PuOm2zuvGbn2zTZWjx80OQrMXl6cRpBmZmU+HXFMEkRgV5JN92OHfbe2t5rueFopllV4mCuGUEDJB9T5YND1Intt7j7h7Z7ru252OybduEd9t8tnNBexGaF4ZijMCqvGa1jWvdQrVSCD0qepfj91907E1RhH3XuzddTCIcr2N2fvHcPZPYuYX1a1qt17sr8jW0NHIWuaOgFHQhuVgB9v7ftFptwrEZJJyMySu0kh+13JIHyWi/Lot5p5633mxwl4LW12tTVLSzgitLWP7IYFRWYf78k8SSnFz0N3s06BvXvfuvdEI/mH/wAxz47/AMs7pbHd0fISbdtbR7n3MmyNhbP2Jglzm6t7bxmxWRzUeFxwrKzF4LFww4zFTzz1eQraWnhijNmeQpG3utqpY0HVcPWPzn/mG783z3h2L0N/K3o9+1e9I+nakUe6fnZ8dsEu1ME/XiV21/4pUbYp96YvIx5SPJVFayUNbMad5Xhe0it7Cmzra/1n5weO713Za1DppYeGogqg1HD6qs9VwtSpyD0EtmjsxzTzo6X3iXmq0DpoZfCUQVQajh9VWeq4WpU5B6w97fEP+ax/NF6vyHRHzPHwz+Gnxv3RksTX7t2r1FQ7j+T3yKrYsLkKbK0UGA3/AL2pdq9Y9eZU1FMIxlsdQ11bCjyKgKMyuK+heCq5GT1c58WvjP1R8Ovj/wBY/GnpHFZDEdY9T4B8Ftuny+SlzGZqjV5GuzeZzObykyRGvzW4M/lKquq5FjiiNRUP44449Ma+6qSSST0P/v3Wuve/de697917r3v3Xuve/de697917r3v3XuvH/fX9+690Vb5q995v4y/GftDubbeKxeW3BtXFUkeG/vHO9HtLE5LM5Kjw1JuHeuQikilx2z9vy14q8jMrBlp4msQTce691TL87Oz/k7vvq3uX4kdg9kdVZLcWz+0v5dm59x9mbA2fmI9i7r2D8ju8c9tjKdIbr29Nm6uoptwYjI9ZxZnIQioAr9p7gx8cif5Uzv7r3Qi/wA1Gv331Hv/AOAmR6aSowsfxO/0vfJjPbO2JVVG38Du3YvUfVlRjdwdfV+Ao5jCm0cnispUPGk2qOFoECnWAffuvdFUwvze7M617N+YHzo2w2e7MwvyL6c2Huv43bCzVc0mPwvW9L3OnRewtx43BzZHF4k7deeabctdOs9OJqStjE1RGCGHuvdHq2Z8w/njX7s6v+PXYnXWB6b7G7Y7i7FwfXnePbWz6PD7a3z1l1j1f112Bk/H1vtrfOeOH3vuTc2+63AYmF8n/lcO266tWHSUt7r3RGPjz8vN5fGjZO8ezKyg2b27mdl9b/zaO585U7K3Hm6faG6NxdM9mdQ1dJjMKq1mTx2P21X1iEVtTKtRU4pY5Uj48in3XurF+9/lD8l/j701s+my/cHVPa/yC7VxG7N/dW4nprqOpzGD3XsbYeyqDde8spixnt/YvDptDb8NXHVT5aoyHk/h9TGY45H59+690z/y+u3az5AfKfurvKviiwWR7c+Enwh35kMZRVprcVhslm6Ptg5A4tpJ5qV6AVsEkkMgLa4Supmtc+690TPsncPb3wv2d8wth7mkgq/krun4h/Ov5AfFz5y7d3rV71m39tzrTbg7AzuG7E2JkK5Jdibp2DFmcdTYSWAVeGYxEwPEw8MnuvdGwwPze776v2H3Bi+z979abizHT/8AL16w+TuK33nseu049w7j3HhpUymezkFVXx0zbVXLU/ieeJgi1DNGzh/T7917orHy5+T/AH58j/i93Xna7dnTfXfWvVneXwc6s3NsHN02QouxN27h31F8V+6MzurH5z+N08O3P47lO1PsNuUHgk+6pcZM7tI8wSL3XujJdU/Pv5qdn9xdl5jDdC1Q+NWzt9fIjrzLZit2/haL/RhT9PbMrK7a26tybpO+qjK5nP7h3ZSpT5DBfwanmoqWZHBudR917orPaH8wz5y1PxZ302a3n1Rs/fndH8rHt35odUb/AOtNs5iCu6c3X1XSYmTMYmqpc3kKyHc6bgos0po6hVhNBVxsWV0C3917qwDBfKb5H9ad4/EDrrvLL7coem+6+uOudrYbuCj2PXZmn7T+SO5NsZ/dmT61z1dQ5dH6rz8+1sKtdhhNR1FLkkgq2kmRzEi+691b97917r3v3Xuve/de697917pvy2Rhw+KyeXqEkkp8Xj63IzpCheZ4aGmkqZUiQXLyMkRCgfU+/de61lMz8+PlrvnqX5bfKTqjbmb2Sd+/Dztns/p7sXc+z98VfWfxwpfj9mauXY2ztw4nP0WP2nvrfHdGCz+UzDZChGvGZKkGNqkkipkI917o7O3Pnn31snrDvIdm0nW27t89C/C7p/5DVO6MZR5Pa2H3buffu3f4pXU2Sw9TWTthsbG8DE+NxZ3IFgoHv3XugG+Yvyv+R3d3x5+SOU63oti7E646H390r1T2E+Wymcw3YG7t4ZvJ9Y7h3dnti5uB4qHb23sHHu6CDGxzpPJm7SIHj1Ae/de6We6vn3vDpzqDvTK7AGHr+xutO+/mxuKDqvMYnf3ZO6e0etvjpnZ89uqXFVuNnWg6zoq2gSoijrMjNFi6CVoqeljmKOi+690pM7/Mw72qsnvfsbaXWvW8HRPUO2Pgz2Bu7D5rM5afsrem1vmRjYq7NY/b1RSLHgsFm+p6CrWsgadZYs28RpwISwce690hsr87/lx0luz5cxdhbh697Wo8j85+u/iL8XsDtrrDdeP/ANGVd2HsPb25KXNb7lwkmVyu+cLg6GuaSohpo46uevVwjpFIoX3XuhTl/mFfIfCbZ6EzfbPUx6G2Pnu6N79U9u9+786/33PsArtXL4vE9f5+g2jTxw7s632t32uTL4zNZ5Rj8TVU709W66o3b3XuhG+bvzz7a6U7cxvSXx/6wbsbfGM6M3D8iMpSSbW3nusb8osPkp8VtTqHZ6bNoKtcTnOxMnQz0xztW7UOHdqZpYnE4I917oON3/zFfkJhOx+y80nVOyMJ0p0V2l8Yuvt/bZ3DX5Ve4c7S/IzaG2s7nqugSEjCbfzPU1fuRYxSzLKubWBwrQMQffuvdDh82Pll391B3PsfpXofbfWVZkM58W/k58m85uXsqpzZpKWm+Oed6Yx1Ns3G4/DSQyzVG+W7Qenaqd9OPEYnKuFKN7r3RStwfzWu8Op9j5jevaXUmyMtL2F8XNg/JTpfAbIy2ZqX2pX767EwHVh6v7BybUdUM4mIzGaXIrnKOCmhqY1NKIVkaNz7r3U74/8Aye+TW1sfsn4sUmyMlF3P2J3b2bQbe+QneGH35g9h712LiMJU7/zHYOA2RukUO7/4mKtzh4NtrNFHRQR/drK0KlffuvdF46O+dXyM6l6tj6uwm1sZvLvvsv5b/wA2ffudqhjd/wDZu08XRdIfM3s3GUXWezKLbNDUZ2uo90ZTJRYehrC6U23aNIJZ4mSWJffuvdWMdUfLP5CfJbf26MPtjYe1ukdodH7H6vznfu0uzBla/trI7m7J2ruDPZ/Y228XjZ8aNm020ocHpo83WLPFmGqdUMSeCUD3XuifbB/mBfJGm6U2Ceq9idajA9e/y6MP80t51fYu6N25/cOVpdsbgzWOy/WeMri7VlbktzYHBOYc1Vuwpawgyo6vx7r3QsYP+Z33J2Z3fhMb1B0DnN29V4/dXQmyt67dptrbwyO+PB3h1tgOyM92THvKixw2Jt7bfUNNuGlpp6SrkaXMo8k8EkYQL7917obPmJ8iO8MlvD5EfHToPH7GwVd078P8l392LvTsioy9NS53H79o+1NubN2TsioxUlOMPkVq+uMhU5LMzvNFi0al/ZYy+/de6JZ1j/MS7W6b+CHyt3TDtjbO5s38Ivi58O96bQqtxZjKVcm+s33Z8fNo9nZ6DdeREiyyxUWfz70lJJAQ88SqTdz7917o7nzFy+e7P+W/xS+GeW3/ALq6u6d7i6+737R3pldj5yo2nuvs7cfUc3X1JtvpjH7sopIcphKPIY7emQ3FV/YvHVzwbfMYYRl/fuvdBB8rPkvF/LV2jhdjdIVdX2jD1rtzG9s9g9R7vfsXsfszKdZbo7Mw+wsnueq7XylXPg9hYfEVuaaSlfJzVEtVLTNDDBo1Ovuvddbt/mHd/bW7Q7JyUnXvXFX0N1L81+m/iPkqamyOXPZ28Ye+svsja2C3rQLI64bAybC3JvanNVTSrN/E6JJHjaJkAb3XumfMfzVc9sTs7t7H1W2aHuDqUdM9o9u9Kb82ZtbdmysPksv1R2FtvrXNbBlzW6YZI98YeqzW98XOdz4uBcZFTLVSJ5oo1dvde6QGQ74+QXU3zS3Vuf5E9hdSbVrpPgfhKjY0uyqXe27dlxb27S+SXVW0tu7areu8TLW7i3hvCPcObp8Pg58ePNuF6wRxpCFYe/de6sa+Afyc318pOod47j7L2SNjb66y7i3x0tuSljpavGU+4K3ZFLgKpN3U2CyEtRkttRZ+lzschxtRLLNRyBo2diL+/de6PF7917r3v3Xuve/de697917r3v3Xuv/S3+Pfuvde9+691737r3Xvfuvde9+691737r3QT919E9NfI/r3MdUd89ZbL7b65z3jbKbQ33gaHcGGmng1/a10EFbFI1BlKIuWp6unaKpp2OqORTz7914Ejh1rHfL/APkBZ/B793C/8uLo/wCO/WnXO8ti4bAw1OT+TPy56T331Vv2Korqeq35tFOr89k9ubooIKeogqZqHMpUxzvE6LF6uSW2tdzj3zc7qe7LbXJFEIo+yiMtdZwoerY4uy04BTxJ7WDdY9+3S7ub1n2qSKIRR0SiMtdZ+ASVbHF2WnAKRm+v+Xf8V+y/hp8V9h9Fdu/I/sP5T9gYGXJZPP8AaXYtbX11WKjLyRTjam12zFfl89DsnbITwY5MhW1dWULOzorpBCddHJNTUDo73v3Wuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917pqzeDw25cPk9v7jxWOzuDzVDU43L4fLUcGQxmTx9ZG0NVRV1DVpLT1VLUROVdHUqwPI9+690C+3Piz8dtpbKPXO3OnNi4rY7btxW+5NtwYWB6CbeWByFFlcJuSo85lmqcrichjaeSmlkdjAYU0aQoHv3Xul9uTqvrneGbTcm6dl7ez+ei2xuDZceUyuOgq6xdp7qg+23Jt3yyhj/Cc3T+iohPokXgj37r3SUp/jp0TSUOBxlP1HsOLG7Y6vPSu38eu3MeaLD9SmGmgbryipjEYIdrGKjiH2gXxnxrxcX9+690kI/ht8XY+sZOmB0lshur5M/FuobOmoJ58ZBuOGVJYc1RyTVMlbQ5GJolCyQyxsqDSPTce/de6V+2fjj0Ls2XHSbV6g6/wBw+I3bgMamM2zjKaClwu/ZMTNvbFx0yQfbtRbsmwVG+QRlK1b06GTUQSfde6DaL4JfD2DAR7Wj+PHWa7eg3fUb8psQcEHo6TddZTLRVmWoY3mb7I1lEghmgiKU0sICNGVAHv3Xuhm2b011V15W1eQ2N17tXadZX7awez6yowOIpcc8+1dsvk5dvbef7ZEX+EYV8zVGmgAEcX3D6QAffuvdI7ZHxY+OnW+S3ll9k9ObEwOS7CpchQ7zrKfCw1E2fx+XRky2MrDXGqVcXlVa1TTRhIKjjyI1hb3XuknV/B/wCI1djOv8NX/HrrLIYrq3HZXDdf4+u27BW0u2cLmqyTIZTB0kdU0qy4OsrpWlajn8tKJDqWMH37r3T1uH4g/GDdm58PvTcvRPW2b3PgcDgdr4rLZHbdFUz0uD2vLSz7ZomidTTVP93ZaGH7KWVHmpREgidQoA917p9/2WfoNeyc92+nVO0Iuyt04XIbe3Ju2DG+DI57E5ej/h2VpsskMiUdfJkqE+KeaSJp5Y+GcgD37r3UiL449DwrgUj6k2Gse1ut8x09t2M7foXhxPVu4Vp0zmwaOF42ji2tlUpYxUUlvFKEFxx7917pO7S+Ivxo2LuHZe69p9L7Iwu4uusIm3Ni5WDGvNUbVw8SzRw0mFFVPPFRmniqJI4pVXzRxOyK4Uke/de6MYAf6/8AG+Pr/vv6e/de679+691737r3XvfuvddMoYFWAZWBVlYAhgRYgg8EEe/de6LBgPhj8Y9sr2RT4XqHbNLie28PuvBb/wBtuK6fa2exO/MhU5XfFC+26islw1JDu/JVTTZAQwx+eSxNvfuvdB5uH+W38Jt243Z+K3P0Bs7PUOxuvW6nwMOT/iNQR1sMjHl6TZWUk+9D5vAYvKwRVFJBVmZaaSJClgLe/de6fN9fAD4e9mbjj3ZvnonZ+4c6mF2pgJ6qtirViyFDsUQLsuXKUUNXFRZSv2qtOgoameN54QoAawFvde6w77/l7/Dbs2nytLvvoTZe4os9k+0spm/u4a2KXLy91zCftSmyU9JWU81Zjd7VSpNW00jNDJLGrBQR7917pZv8OvjY+C3bto9T7aGD31hOpNt7rxqwSLTZnB9FUq0HU+OqVEvFPsukRUpAttKixv7917qNuX4W/F/eGV7izO5OntrZSu79qdrZHtx5oqpE3pm9k0VNj9qbkrkhqYxT7lwePo4YIK+n8NSI4UUudI9+691Gznwj+MO6Md1/it09V4ndGO6yrZMjtWi3DXZfLUy1z5SLOCozENbkJYtwNFm4Eq0WtE6JOisALW9+690se3/jF0Z3vkNr5ntHr7Fbjzey6fI0W2c2s1di8zicVmmoWzmEgyWIqqGrbC5pMdClVSszQyoltIPPv3Xuoud+KnQG5m36+d6zwGRbs/cuxN377M8cx/vHuPrKgxuK2Lla/wDdu9Tt2gxFPHARayxC9/fuvdKfenQ/U3Ym8qHsHeWysTnt443rTsLp6iztbG5rIOtu1a3amQ3/ALVRlcL/AA3ctZsjFSVAtdmo0sR7917pFVPxA+NdfQQ4rJdQ7RyeKg6aPx8TGZGhNZQt04czS7g/uLJTzOyPiFzVDDUqP1rLGrKwIB9+690nq34N/FvJ9dYPqrK9UYrK7N2zvP8A0h7bpsnkc3XZPb+9RAaRNxYbO1GSkzOPyCULGnBinVfB6CCvHv3XumxfgB8QIevNrdXY/o3amI2XsXdO+96bKxmFORxNTtXcvaGdq9ydiZPCZWhrocpQy7yy+QmlyKiYrUlzrBsLe690rsz8O/jZnezds9yV/VG3v9Ju08Bt3amL3hStX0WWqNs7QlNVtPBZqSkrIUz+N23Wnz0SVqzmCUXU2LA+691iw3w1+NGAwVdtnEdS7aocFkejp/jdW4+GKYQVHSdRU5Crm6/cGUscJJPlahyt9V5Tz7917rjifhn8asDvbafYmC6rwuE3fsrA7Q2xhctianJ48vhevsHFtvYtJlaWkroqPMjaeDhFNQtVRytDHwCRa3uvdT+7fiL8cvkZmMHn+6OqNt77zO3sNmNuUGSycdVDVS7X3AIzmtq5KahqaV8ptvJTwRSy0dQZIDLEraQb3917oL95/wAtz4Rdgw0NLvD477EzdLQbI2l1ylLPTVkdLV7N2DJSy7EwmUpKeshp8tT7Mko4zjGqFkekCBUIUW9+690Ofefxz6T+Sm2aDaXd/XWA7Aw+FzFPuPb4y8EiZDbu4qOOSOjzu3svRy0+Uw2VpllYLLBKjEGzXXj37r3QCZ/+Wr8It2UWDod1dA7T3JHgcNPgIZ85Nl8hW5LGVG4aPd5gz9ZPkWqM8Id10EWRi+7aURVa60AuR7917oX8p8Tfj1mYdzwZLrHb9VFvLt3ZHfG5Ukjmtle2uuMvgs7sretRaUf7lcBlttUU0BFlD063B9+690hdr/AD4c7M3FlN0ba6C2NjMxmts9h7KyMyUlVNSy7N7Wq6XIb/ANqRY+pq5qGk29uOvokmmpIY44VkuUVb+/de6TWP/lq/B7G4rLYWk+PGy0os3trB7QyLS/xOprX29tTd+39/bNx8GSqMhLkKNNmbv2tj6/EvDIklBUUkbRFSPfuvdGM6X6G6h+PO2cps7pfYeF692zmty5HeOWxGDSdIMhujL0mOocnnKtqmeommyNfTYmnWWRmJbxgnn37r3Qu+/de697917r3v3Xuve/de697917r/09/j37r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691//Z',
			      width: 300
			    },
			    { text: ' \n'},
			    { text: 'Couple Match Ranking for Applicant A and Applicant B', style: 'header' },
			    { text: ' \n'},
			    {text: ' '},
   		        {
			          table: {
			            // headers are automatically repeated if the table spans over multiple pages
			            // you can declare how many rows should be treated as headers
			            headerRows: 1,
			            widths: [ 50, 100, '*' ],
			            body: [
			              [ { text: 'Rank', style: 'subheader' }, { text: 'Applicants', style: 'subheader'}, { text: 'Items', style: 'subheader'} ],
			            ]
			          }
			        },
			    
			  ],

			  styles: {
			    header: {
			      fontSize: 18,
			      bold: true
			    },
			   subheader: {
				      bold: true
				    },
			    anotherStyle: {
			      italics: true,
			      alignment: 'right'
			    }
			  }
			};  
	  
	  
	  for (let i=0;i<this.manualItems.length;i++){
		  
		  let row=[];
		  let order= {'rowSpan':2,'text':''};
		  order.rowSpan=2;
		  order.text=i+1 + '';
//		  rowSpan:2, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' } 

		  if (this.optionWhoLeading=="A"){
		  
		  row.push(order);
		  row.push(this.nameA);
		  let combined= this.manualItems[i].A.location + " : " + this.manualItems[i].A.category  + ". ";
		  if (this.manualItems[i].A.note.length>0)
		  combined+="[note: " + this.manualItems[i].A.note + "]" 
		  row.push(combined);
		  
		  docDefinition.content[5].table.body.push(row);
		  row=[];

		  row.push('');
		  row.push(this.nameB);
		  
		  combined= this.manualItems[i].B.location + " : " + this.manualItems[i].B.category  + ". ";
		  if (this.manualItems[i].B.note.length>0)
		  combined+="[note: " + this.manualItems[i].B.note + "]" 
		  
		  row.push(combined);
		  
		  }
		  else{
			  row.push(order);
			  row.push(this.nameB);
			  
		  let combined= this.manualItems[i].B.location + " : " + this.manualItems[i].B.category  + ". ";
		  if (this.manualItems[i].B.note.length>0)
		  combined+="[note: " + this.manualItems[i].B.note + "]" 
		  
		  row.push(combined);
			  
			  
//			  row.push(this.manualItems[i].B.location + " (" + this.manualItems[i].B.category  + ") ");
			  
			  docDefinition.content[5].table.body.push(row);
			  row=[];

			  row.push('');
			  row.push(this.nameA);
			  
			  combined= this.manualItems[i].A.location + " : " + this.manualItems[i].A.category  + ". ";
		  	  if (this.manualItems[i].A.note.length>0)
		  		combined+="[note: " + this.manualItems[i].A.note + "]" 
		  	  row.push(combined);
			  
			  
			  //row.push(this.manualItems[i].A.location);
		  }

		  docDefinition.content[5].table.body.push(row);
	  }
	  
	  let filename = "match_"+this.nameA1+"_"+this.nameB1+".pdf";
	  
	  if (this.optionWhoLeading=="A"){
		  docDefinition.content[2].text = "Couple Match for " + this.nameA + " and " + this.nameB;
	  }else{
		  docDefinition.content[2].text = "Couple Match for " + this.nameB + " and " + this.nameA;
		  let filename = "match_"+this.nameB1+"_"+this.nameA1+".pdf";
	  }
	  
	  console.log(docDefinition.content[0]);
	  console.log(docDefinition.content[5]);
	  console.log(docDefinition.content[5].table.body[0][0]);
	  
	  
	// download the PDF
	  pdfMake.createPdf(docDefinition).download(filename);
  }

   displayManualRankItem(item, who){
		return displayAutoRankItem(item, who);
	}
	
	displayAutoRankItem(item, who){
    //{{item.A.location}} : {{item.A.category}}. {{item.A.note.length>0?"[note: item.A.note]":""}}
    let display = "";
    if (who=='A'){
	  display = item.A.location + " : "  + item.A.category + ".";
	  if (item.A.note.length>0)
	  display+=" [note: " + item.A.note + "]";
	}

    if (who=='B'){
	  display = item.B.location + " : "  + item.B.category + ".";
	  if (item.B.note.length>0)
	  display+=" [note: " + item.B.note + "]";
	}
     
     return display;

	}
	

	displayMe(item, full){

	let display = item.location + " : " + item.category + "." ;
	
	if (item.note.length!=0)
	  display+=" [note:" + item.note + "]"
	  
	  if (full==1 || display.length<40)
	    return display;
	  else
	    return display.substring(0,40) + "...";
	

	}
	
}

