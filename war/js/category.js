var Category = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
	this.mode = 'readOnly';
};

Category.prototype.clear = function() {
	this.name = "";
	this.parentCategoryId = null;
	this.parentCategoryName = null;
	this.visible = false;
	this.mode = 'readOnly';
};

		app.controller(
				'categoryController',
				function($scope, $http) {
					var URL = "/_ah/api/categoryendpoint/v1/category/";

					$scope.categories = [];
					$scope.newCategory = new Category();

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
						$scope.newCategoryForm.$setPristine();
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
										var newCategory = new Category;
										newCategory.id = data.items[i].id.id;
										newCategory.name = data.items[i].name;
										newCategory.parentId = data.items[i].parentCategory != null ? data.items[i].parentCategory.id.id : null;
										newCategory.parentName = data.items[i].parentCategory != null ? data.items[i].parentCategory.name : null;
													
										$scope.categories.push(newCategory);
									}

									$scope.categories
											.sort(function(a, b) {
												return a.name.localeCompare(b.name);
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
											$scope.newCategoryForm.$setPristine();
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
											editedCategory.mode = "readOnly";
											$scope.refreshCategories();
										},
										function(response) {

											addAlert("Nie udało się zmodyfikować kategorii <b>'"
													+ editedCategory.name
													+ "'</b> - spróbuj ponownie póżniej. /n"
													+ "Status: "
													+ response.status
													+ ", Info: "
													+ response.data);
										});

					};
					
					$(document).ready(function() {
						$scope.refreshCategories();
					});
					


				});