		app.controller(
				'categoryController', 
				function($scope, $rootScope, $http, $translate) {
					$scope.orderByField = 'name';
					$scope.reverseSort = false;
					
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

					$scope.cancelEditCategory = function(editedCategory) {
						$http
						.get($rootScope.categoriesURL + editedCategory.id)
						.then(
								function(response) {
									var categoryFromServer = $rootScope.createNewCategory(response.data);
									$scope.categories[$scope.categories.indexOf(editedCategory)] = categoryFromServer;

									getCategory(editedCategory.id).mode = "readOnly";
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
									    addAlert(message, response);
									  });
								});
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
														$scope.categories.splice($scope.categories.indexOf(categoryToDelete), 1);
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
											
											var newCategory = $rootScope.createNewCategory(response.data);
											$scope.categories.push(newCategory);
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
											
											var updatedCategory = $rootScope.createNewCategory(response.data);
											$scope.categories[$scope.categories.indexOf(editedCategory)] = updatedCategory;
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