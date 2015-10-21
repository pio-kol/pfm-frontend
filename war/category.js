var Category = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
};

Category.prototype.clear = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
};

function addAlert(message) {
	$('#alerts')
			.append(
					'<div id="dataLoadFailedAlert" class="alert alert-danger alert-dismissible" role="alert">'
							+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
							+ '<span aria-hidden="true">&times;</span>'
							+ '</button>' + message + '</div>');
	$("#dataLoadFailedAlert").delay(3000).fadeOut(function() {
		$(this).remove();
	});

}

function activateSelects() {
	$(".chosen-select").chosen({
		no_results_text : "Nie znaleziono:",
		width : "80%"
	});
}

$(window).load(function() {
	activateSelects();
});

angular
		.module('myApp', [])
		.controller(
				'categoryController',
				function($scope) {

					$scope.categories = [];

					$scope.newCategory = new Category();

					$(document).ready(function() {
						$scope.refreshCategories();
					});

					$scope.addNewCategory = function(id) {
						$scope.newCategory.visible = true;
					}

					$scope.cancelAddNewCategory = function() {
						$scope.newCategory.clear();
					}

					function getCategory(id) {
						for (var i = 0; i < $scope.categories.length; ++i) {
							var category = $scope.categories[i];
							if (id == category.id) {
								return category;
							}
						}
					}

					$scope.editCategory = function(id) {
						getCategory(id).mode = "edit";
						activateSelects();
					};

					$scope.cancelEditCategory = function(id) {
						getCategory(id).mode = "readOnly";
						$scope.refreshCategories();
					};

					$scope.refreshCategories = function() {

						$
								.ajax({
									url : "/_ah/api/categoryendpoint/v1/category",
									dataType : 'json',
									success : function(data) {
										$scope.categories = [];
										for (i = 0; i < data.items.length; ++i) {
											$scope.categories
													.push({
														id : data.items[i].id.id,
														name : data.items[i].name,
														parentId : data.items[i].parentCategory != null ? data.items[i].parentCategory.id
																: null,
														parentName : data.items[i].parentCategory != null ? data.items[i].parentCategory.name
																: null,
														mode : "readOnly"
													});
										}

										$scope.categories
												.sort(function(a, b) {
													return a.name
															.localeCompare(b.name);
												});
										$scope.$apply();
									},
									error : function(data) {
										addAlert("Nie udało się pobrać danych - spróbuj ponownie póżniej.");
									}
								});
					}

					$scope.saveNewCategory = function() {

						var category = {
							"parentCategory" : {
								"id" : {
									"id" : $scope.newCategory.parentCategoryId
								}
							},
							"name" : $scope.newCategory.name
						}

						$
								.ajax({
									url : "/_ah/api/categoryendpoint/v1/category",
									contentType : "application/json",
									type : 'POST',
									data : JSON.stringify(category),
									success : function(data) {
										$scope.newCategory.clear();
										$scope.$apply();
									},
									error : function(data) {
										addAlert("Nie udało się dodać nowego konta - spróbuj ponownie póżniej.");
									}
								});

					};

					$scope.removeCategory = function(id, name) {
						bootbox
								.confirm(
										"Konto <b>'"
												+ name
												+ "'</b> zostanie usuniete. Kontynuowac?",
										function(result) {
											if (result) {
												$
														.ajax({
															url : "/_ah/api/categoryendpoint/v1/category/"
																	+ id,
															type : 'DELETE',
															success : function(
																	data) {
																$scope
																		.refreshCategories();
															},
															error : function(
																	data) {
																addAlert("Nie udało się usunąć konta <b>'"
																		+ name
																		+ "'</b> - spróbuj ponownie póżniej.");
															}
														});
											}
										});
					};

					$scope.saveCategory = function(category) {
						var category = {
							"parentCategory" : {
								"id" : {
									"id" : category.parentId
								}
							},
							"name" : category.name,
							"id" : {
								"id" : category.id
							}
						}

						$
								.ajax({
									url : "/_ah/api/categoryendpoint/v1/category",
									contentType : "application/json",
									type : 'PUT',
									data : JSON.stringify(category),
									success : function(data) {
										category.mode = "readOnly";
										$scope.$apply();
									},
									error : function(data) {
										addAlert("Nie udało się zmodyfikować konta <b>'"
												+ name
												+ "'</b> - spróbuj ponownie póżniej.");
									}
								});

					};

				});