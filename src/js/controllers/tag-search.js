export default class TagSearchConroller {
	constructor() {
		this.bindListeners();
	}
	
	bindListeners(){
		$(document).ready(function () {
			$("#filters").css({"display" : "block"}); //Set the search form visible if the user has javascript enabled...
			$("#noJavaScriptMessage").css({"display" : "none"}); //If user has javascript, hide this element. If they have no JS, User friendly message will display to them.
			//var searchBar = $('<legend>Search by Title:</legend><input style ="display:none;"id="searchFilter" type="text" name="search" placeholder="Search Paper Name with Filters">');
			//$("#filters").append(searchBar); //Code used to add element to page if user has javascript installed.
			$("#searchFilter").css({"display" : "block"});
			var initialSection = $('#initialSectionSelection').text();
			var selectedSection = initialSection; //Variable used to pass data between searchFilter, Checkbox Filter, and Selected option filter.
			var currentSearchField = ""; //Variable used to pass data between the checkbox filters and typed in filters. Used to integrate the two together
			
			//Copyright and credit given to http://kronosapiens.github.io/blog/2014/03/31/a-dynamic-and-generally-efficient-front-end-filtering-algorithm.html.
			$("#filters :checkbox").click(function () {
				applyTagFilter();
				applySearchFieldFilter(currentSearchField); //passes substring still in input textbox to function
				selectedSection = textBoxChange();
				//This code is used to hide a section if all elements are filtered out.
				checkSectionAfterFilter();
			});
			
			$("#searchFilter").on("keyup", function () {
				currentSearchField = $(this).val().toLowerCase(); //Grab the new substring entered
				applySearchFieldFilter(currentSearchField); //pass the input to the function
				selectedSection = textBoxChange();
				checkSectionAfterFilter();
			});
			
			
			$("#select-box").change(function(){
				selectedSection = textBoxChange();
				checkSectionAfterFilter();
			});
			
			/*
			function that contains logic performed when user types into the search bar.
			 */
			function applySearchFieldFilter(searchBarFilter){
				//iterate through all paper titles, compare the search entry to the passed in parameter
				$(".paper-title").each(function () {
					var nameSearched = $(this).text().toLowerCase();
					var $filteredElement = $(this).parent().parent();
					var activeFilters = getActiveFilters();
					var paperFilters = $filteredElement.data("filters");
					if (nameSearched.indexOf(searchBarFilter) != -1 && lessonQualified(activeFilters, paperFilters) ) {
						//Show the item and add a class of searchSelected on its parents parent, ie the list item
						$filteredElement.show();
					}
					else {
						//hide the item and remove the class if it exists of the list item.
						$filteredElement.hide();
					}
				});
			}
			
			/*
			Function to hold logic for applying filtering to papers using Tagging system.
			 */
			function applyTagFilter() {
				$(".filtered-content").hide();
				var activeFilters = getActiveFilters();
				$(".filtered-content").each(function () {
					var $paper = $(this);
					var paperFilters = $paper.data("filters");
					if (lessonQualified(activeFilters, paperFilters)) {
						$paper.show();
					}
				});
			}
			
			/*
			Function used to grab active filters. Utility function of 
			//Copyright and credit given to http://kronosapiens.github.io/blog/2014/03/31/a-dynamic-and-generally-efficient-front-end-filtering-algorithm.html.
			 */
			function getActiveFilters() {
				var filterArray = [];
				$("#filters :checkbox:checked").each(function () {
					filterArray.push(($(this).attr("id")));
				});
				return filterArray;
			}
			/*
			similar to above, Utility function of
			 //Copyright and credit given to http://kronosapiens.github.io/blog/2014/03/31/a-dynamic-and-generally-efficient-front-end-filtering-algorithm.html.
			 */
			function lessonQualified(filters, lesson) {
				for (var i = 0; i < filters.length; i++) {
					if ((lesson.indexOf(filters[i])) == -1) {
						return false;
					}
				}
				return true;
			}
			
			/*
			Function used to detect when select option dropdown box has been modified by end-user. Shows appropriate section of papers to end-user
			 */
			function textBoxChange() {
				var selectedSection = $(":selected").text();
				$(".paper-section").each(function() {
					$(this).parent().hide();
					if(selectedSection === initialSection){
						$(this).parent().show();
					}
					else if(selectedSection === $(this).prev().text()){
						$(this).parent().show();
					}
				});
				return selectedSection;
			}
			
			/*
			A function that is called to check whether to show or hide a UX message "Nothing was found. Try widening your search criteria"
			 */
			function checkSectionAfterFilter() {
				$(".paper-section").each(function(){
					//$(this).parent().show();
					if($(this).children(':visible').length === 0) {
						$(this).parent().hide();
					}
				});
				if($(".paper-section:visible").length === 0){
					$("#noResultMessage").show();
				}
				else{
					$("#noResultMessage").hide();
				}
				
			}
		});
	}
}