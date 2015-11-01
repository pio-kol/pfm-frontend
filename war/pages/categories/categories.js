		app.controller(
				'categoryController', 
				function($scope, $rootScope, $http, $translate) {
					$scope.orderByField = 'name';
					$scope.reverseSort = false;
					
					$scope.newCategory = new Category();

					$scope.categoriesForSelect = function(id){
						var filteredCategories = [];
						for (var i = 0; i < $rootScope.categories.length; ++i) {
							var category = $rootScope.categories[i];
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
						for (var i = 0; i < $rootScope.categories.length; ++i) {
							var category = $rootScope.categories[i];
							if (id == category.id) {
								return category;
							}
						}
					}

					$scope.editCategory = function(category) {
						category.editMode();
					};

					$scope.cancelEditCategory = function(category) {
						category.readOnlyMode(); 
					};

					

					$scope.removeCategory = function(categoryToDelete) {
						$translate('CONFIRM_REMOVE_CATEGORY', {name : categoryToDelete.name}).then(function (message) {
						bootbox 
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete($rootScope.categoriesURL + categoryToDelete.id)
											.then(
													function(response) {
														$rootScope.categories.splice($rootScope.categories.indexOf(categoryToDelete), 1);
													},
													function(response) {
														$translate('ERROR_CATEGORY_REMOVE', {name : categoryToDelete.name}).then(function (message) {
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
							category.parentCategoryId = newCategory.parentCategory.id;
						}

						$http
								.post($rootScope.categoriesURL,
										category)
								.then(
										function(response) {
											$scope.newCategory = new Category();
											$scope.newCategoryForm.$setPristine();
											
											var newCategory = $rootScope.createNewCategory(response.data);
											$rootScope.updateParentCategoryReference(newCategory);
											
											$rootScope.categories.push(newCategory);
										},
										function(response) {
											$translate('ERROR_CATEGORY_ADD', {name : newCategory.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};

					$scope.saveCategory = function(editedCategory) {
						var category = {
							"name" : editedCategory.copyForEdit.name,
							"id" : {
								"id" : editedCategory.id
							}
						}

						if (editedCategory.copyForEdit.parentCategory != null && editedCategory.copyForEdit.parentCategory.id != null) {
							category.parentCategoryId = editedCategory.copyForEdit.parentCategory.id;
						}

						$http
								.put($rootScope.categoriesURL, category)
								.then(
										function(response) {
											editedCategory.readOnlyMode();
											
											var updatedCategory = $rootScope.createNewCategory(response.data);
											$rootScope.updateParentCategoryReference(updatedCategory);
											
											$rootScope.categories[$rootScope.categories.indexOf(editedCategory)] = updatedCategory;
										},
										function(response) {
											$translate('ERROR_CATEGORY_MODIFY', {name : editedCategory.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};
					
					$(document).ready(function() {
						$rootScope.refreshCategories();
					});
					


				});