export default class TagSearchConroller {
	constructor() {
		this.bindListeners();
	}
	
	bindListeners(){
		$(document).ready(function () {
			var searchBar = $('<input style ="display:none;"id="searchFilter" type="text" name="search" placeholder="Search Paper by name With Filters">');
			$("#filters").append(searchBar);
			$("#searchFilter").css({"display" : "block"});
			var selectedSection = "All Sections";
			var currentSearchField = "";
			//Copyright and credit given to http://kronosapiens.github.io/blog/2014/03/31/a-dynamic-and-generally-efficient-front-end-filtering-algorithm.html
			//NO liscense on code, however credit due.
			$("#filters :checkbox").click(function () {
				applyTagFilter();
				applySearchFieldFilter(currentSearchField);
				selectedSection = textBoxChange();
				//This code is used to hide a section if all elements are filtered out.
				checkSectionAfterFilter();
			});
			
			$("#searchFilter").on("keyup", function () {
				currentSearchField = $(this).val().toLowerCase();
				applySearchFieldFilter(currentSearchField);
				//applyTagFilter();
				selectedSection = textBoxChange();
				checkSectionAfterFilter();
			});
			
			
			$("#select-box").change(function(){
				selectedSection = textBoxChange();
				checkSectionAfterFilter();
			});
			
			function applySearchFieldFilter(searchBarFilter){
				console.log("hitting search keyup)");
				//iterate through all items containing class student-details, grabbing h3 to grab text of this variable.
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
			
			function getActiveFilters() {
				var filterArray = [];
				$("#filters :checkbox:checked").each(function () {
					filterArray.push(($(this).attr("id")));
				});
				return filterArray;
			}
			function lessonQualified(filters, lesson) {
				for (var i = 0; i < filters.length; i++) {
					if ((lesson.indexOf(filters[i])) == -1) {
						return false;
					}
				}
				return true;
			}
			
			function textBoxChange() {
				var selectedSection = $(":selected").text();
				$(".paper-section").each(function() {
					$(this).parent().hide();
					if(selectedSection ==="All Sections"){
						$(this).parent().show();
					}
					else if(selectedSection === $(this).prev().text()){
						$(this).parent().show();
					}
				});
				return selectedSection;
			}
			
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