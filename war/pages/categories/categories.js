		app.controller(
				'categoryController', 
				function($scope, $rootScope, $http, $translate) {
					$scope.orderByField = 'name';
					$scope.reverseSort = false;
					
					$scope.newCategory = new Category();

					var doesCategoriesCauseCycle = function(category, potential_parent_category){
						var tmpCategory = potential_parent_category.parentCategory;
						while(tmpCategory != null){
							if (tmpCategory === category){
								return true;
							}
							tmpCategory = tmpCategory.parentCategory;
						}
						return false;
					}

					$scope.categoriesForSelect = function(category){
						var filteredCategories = [];
						for (var i = 0; i < $rootScope.categories.length; ++i) {
							var other_category = $rootScope.categories[i];
							if (category.id != other_category.id && !doesCategoriesCauseCycle(category, other_category)) {
								filteredCategories.push(other_category);
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
											editedCategory.name = editedCategory.copyForEdit.name;
											if (editedCategory.copyForEdit.parentCategory != null && editedCategory.copyForEdit.parentCategory.id != null) {
												editedCategory.parentCategory = editedCategory.copyForEdit.parentCategory;
												editedCategory.parentCategoryId = editedCategory.copyForEdit.parentCategory.id;
											}
											editedCategory.readOnlyMode();
											$rootScope.updateParentCategoryReference(editedCategory);
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