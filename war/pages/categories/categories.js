		app.controller(
				'categoryController', 
				function($scope, $rootScope, $http, $translate) {

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
						$scope.newCategory = new Category();
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

					

					$scope.removeCategory = function(id, categoryName) {
						$translate('CONFIRM_REMOVE_CATEGORY', {name : categoryName}).then(function (message) {
						bootbox 
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete($rootScope.categoriesURL + id)
											.then(
													function(response) {
														$scope.refreshCategories();
													},
													function(response) {
														$translate('ERROR_CATEGORY_REMOVE', {name : categoryName}).then(function (message) {
														    addAlert(message, response);
														  });
													});

										});
						});

					};

					$scope.saveNewCategory = function(newCategory) {

						var category = {
							"name" : newCategory.name
						}

						if (newCategory.parentCategory != null && newCategory.parentCategory.id != null) {
							category.parentCategory = {
								"id" : {
									"id" : newCategory.parentCategory.id
								}
							}
						}

						$http
								.post($rootScope.categoriesURL,
										category)
								.then(
										function(response) {
											$scope.newCategory = new Category();
											$scope.newCategoryForm.$setPristine();
											$scope.refreshCategories();
										},
										function(response) {
											$translate('ERROR_CATEGORY_ADD', {name : newCategory.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};

					$scope.saveCategory = function(editedCategory) {
						var category = {
							"name" : editedCategory.name,
							"id" : {
								"id" : editedCategory.id
							}
						}

						if (editedCategory.parentCategory != null && editedCategory.parentCategory.id != null) {
							category.parentCategory = {
								"id" : {
									"id" : editedCategory.parentCategory.id
								}
							}
						}

						$http
								.put($rootScope.categoriesURL, category)
								.then(
										function(response) {
											editedCategory.mode = "readOnly";
											$scope.refreshCategories();
										},
										function(response) {
											$translate('ERROR_CATEGORY_MODIFY', {name : editedCategory.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};
					
					$(document).ready(function() {
						$scope.refreshCategories();
					});
					


				});