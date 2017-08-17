export default class TagSearchConroller {
	constructor() {
		this.bindListeners();
	}
	
	bindListeners(){
		$(document).ready(function () {
			var selectedSection = "All Sections";
			//Copyright and credit given to http://kronosapiens.github.io/blog/2014/03/31/a-dynamic-and-generally-efficient-front-end-filtering-algorithm.html
			//NO liscense on code, however credit due.
			$("#filters :checkbox").click(function () {
				$(".filtered-content").hide();
				var activeFilters = getActiveFilters();
				$(".filtered-content").each(function () {
					var $paper = $(this);
					var paperFilters = $paper.data("filters");
					if (lessonQualified(activeFilters, paperFilters)) {
						$paper.show();
					}
				});
				
				selectedSection = textBoxChange();
				//This code is used to hide a section if all elements are filtered out.
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
			});
			
			$("#select-box").change(function(){
				selectedSection = textBoxChange();
			});
			
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
		});
	}
}