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

						if (newCategory.parentCategoryId != null) {
							category.parentCategory = {
								"id" : {
									"id" : newCategory.parentCategoryId
								}
							}
						}

						$http
								.post($rootScope.categoriesURL,
										category)
								.then(
										function(response) {
											newCategory.clear();
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

						if (editedCategory.parentId != null) {
							category.parentCategory = {
								"id" : {
									"id" : editedCategory.parentId
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