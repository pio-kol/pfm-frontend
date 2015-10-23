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

var URL = "/_ah/api/categoryendpoint/v1/category/";

angular
		.module('myApp', [ 'angular.chosen' ])
		.controller(
				'categoryController',
				function($scope, $http) {

					$scope.categories = [];

					$scope.newCategory = new Category();

					$(document).ready(function() {
						$scope.refreshCategories();
					});
					
					$scope.categoriesForSelect = function(id){
						var filteredCategories = [];
						for (var i = 0; i < $scope.categories.length; ++i) {
							var category = $scope.categories[i];
							if (id != category.id) {
								filteredCategories.push(category);
							}
						}
						return filteredCategories;
					};

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
					};

					$scope.cancelEditCategory = function(id) {
						getCategory(id).mode = "readOnly";
						$scope.refreshCategories();
					};

					$scope.refreshCategories = function() {

						$http
						.get(URL)
						.then(
								function(response) {
									$scope.categories = [];
									
									var data = response.data;
									for (i = 0; i < data.items.length; ++i) {
										$scope.categories
												.push({
													id : data.items[i].id.id,
													name : data.items[i].name,
													parentId : data.items[i].parentCategory != null ? data.items[i].parentCategory.id.id
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
								},
								function(response) {
									addAlert("Nie udało się pobrać danych - spróbuj ponownie póżniej. /n"
											+ "Status: "
											+ response.status
											+ ", Info: "
											+ response.data);
								});
					}

					$scope.removeCategory = function(id, name) {
						bootbox
								.confirm(
										"Kategoria <b>'"
												+ name
												+ "'</b> zostanie usuniete. Kontynuowac?",
										function(result) {
											if (!result) {
												return;
											}
											$http.delete(URL + id)
											.then(
													function(response) {
														$scope.refreshCategories();
													},
													function(response) {
														addAlert("Nie udało się usunąć kategorii <b>'"
													+ name
													+ "'</b> - spróbuj ponownie póżniej. /n"
																+ "Status: "
																+ response.status
																+ ", Info: "
																+ response.data);
													});

										});

					};

					$scope.saveNewCategory = function(newCategory) {

						var category = {
							"name" : newCategory.name
						}

						if (newCategory.parentCategoryId != null) {
							category.parentCategory = {
								"id" : {
									"id" : newCategory.parentCategoryId
								}
							}
						}

						$http
								.post(URL,
										category)
								.then(
										function(response) {
											newCategory.clear();
											$scope.refreshCategories();
										},
										function(response) {
											addAlert("Nie udało się dodać nowej kategorii - spróbuj ponownie póżniej. /n"
													+ "Status: "
													+ response.status
													+ ", Info: "
													+ response.data);
										});

					};

					$scope.saveCategory = function(editedCategory) {
						var category = {
							"name" : editedCategory.name,
							"id" : {
								"id" : editedCategory.id
							}
						}

						if (editedCategory.parentId != null) {
							category.parentCategory = {
								"id" : {
									"id" : editedCategory.parentId
								}
							}
						}

						$http
								.put(URL, category)
								.then(
										function(response) {
											category.mode = "readOnly";
											$scope.refreshCategories();
										},
										function(response) {

											addAlert("Nie udało się zmodyfikować kategorii <b>'"
													+ name
													+ "'</b> - spróbuj ponownie póżniej. /n"
													+ "Status: "
													+ response.status
													+ ", Info: "
													+ response.data);
										});

					};

				});