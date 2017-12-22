app.controller(
    'categoryController',
    function ($scope, $rootScope, $http, $translate, googleService) {
        $scope.orderByField = 'name';
        $scope.reverseSort = false;

        $scope.newCategory = new Category();

        function doCategoriesCauseCycle(category, potential_parent_category) {
            var tmpCategory = potential_parent_category.parentCategory;
            while (tmpCategory != null) {
                if (tmpCategory === category) {
                    return true;
                }
                tmpCategory = tmpCategory.parentCategory;
            }
            return false;
        }

        $scope.isUsedAsParentCategory = function (category) {
            for (var i = 0; i < $rootScope.categories.length; ++i) {
                var potential_child_category = $rootScope.categories[i];
                if (potential_child_category.parentCategory.id === category.id) {
                    return true;
                }
            }
            return false;
        };

        $scope.categoriesForSelect = function (category) {
            var filteredCategories = [];
            for (var i = 0; i < $rootScope.categories.length; ++i) {
                var other_category = $rootScope.categories[i];
                if (category.id != other_category.id && !doCategoriesCauseCycle(category, other_category)) {
                    filteredCategories.push(other_category);
                }
            }
            return filteredCategories;
        };

        $scope.addNewCategory = function (id) {
            $scope.newCategory.visible = true;
        }

        $scope.cancelAddNewCategory = function () {
            $scope.newCategory = new Category();
            $scope.newCategoryForm.$setPristine();
        }

        $scope.editCategory = function (category) {
            //category.copyForEdit = JSON.parse(JSON.stringify(category));
            category.editMode();
        };

        $scope.cancelEditCategory = function (category) {
            category.readOnlyMode();
        };


        $scope.removeCategory = function (categoryToDelete) {
            $translate('CONFIRM_REMOVE_CATEGORY', {name: categoryToDelete.name}).then(function (message) {
                bootbox
                    .confirm(message,
                        function (result) {
                            if (!result) {
                                return;
                            }
//											googleService.callScriptFunction("deleteCategory", categoryToDelete.id)
                            $http.delete("http://localhost:8080/v1/categories/" + categoryToDelete.id, categoryToDelete.id)
                                .then(
                                    function (response) {
                                        $rootScope.categories.splice($rootScope.categories.indexOf(categoryToDelete), 1);
                                    },
                                    function (response) {
                                        $translate('ERROR_CATEGORY_REMOVE', {name: categoryToDelete.name}).then(function (message) {
                                            addAlert(message, response);
                                        });
                                    });

                        });
            });

        };

        $scope.saveNewCategory = function (newCategory) {
            var category = {
                "name": newCategory.name
            }
            if (newCategory.parentCategory != null && newCategory.parentCategory.id != null) {
                category.parentCategory = {}
                category.parentCategory.id = newCategory.parentCategory.id;
            }

            $http.post("http://localhost:8080/v1/categories/", category)
                .then(
                    function (response) {
                        $scope.newCategory = new Category();
                        $scope.newCategoryForm
                            .$setPristine();

                        var newCategory = $rootScope.createNewCategory(response);
                        $scope.categories.push(newCategory);
                        $scope.refreshCategories();
                    },
                    function (response) {
                        $translate('ERROR_ACCOUNT_ADD', {name: newCategory.name}).then(function (message) {
                            addAlert(message, response);
                        });
                    });
        };

        $scope.saveCategory = function (editedCategory) {
            var category = {
                "name": editedCategory.copyForEdit.name,
                "id": editedCategory.id
            }

            if (editedCategory.copyForEdit.parentCategory != null && editedCategory.copyForEdit.parentCategory.id != null) {
                category.parentCategory = {}
                category.parentCategory.id = editedCategory.copyForEdit.parentCategory.id;
            }

//						googleService.callScriptFunction("updateCategory", category)
            $http.put("http://localhost:8080/v1/categories/" + category.id, category)
                .then(
                    function (response) { // TODO should take category from response
                        editedCategory.name = editedCategory.copyForEdit.name;
                        if (editedCategory.copyForEdit.parentCategory != null && editedCategory.copyForEdit.parentCategory.id != null) {
                            editedCategory.parentCategory = category.parentCategory = {}
                            editedCategory.parentCategory.id = editedCategory.copyForEdit.parentCategory.id;
                        }
                        editedCategory.readOnlyMode();
                        $rootScope.updateParentCategoryReference(editedCategory);
                        $scope.refreshCategories();
                    },
                    function (response) {
                        $translate('ERROR_CATEGORY_MODIFY', {name: editedCategory.name}).then(function (message) {
                            addAlert(message, response);
                        });
                    });

        };


        $(document).ready(function () {
            $rootScope.refreshCategories();
        });


    });