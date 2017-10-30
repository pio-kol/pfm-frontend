app
		.factory(
				'categoriesService',
				["$q", "$translate", 'googleService', '$http',
						function($q, $translate, googleService, $http) {
							var service = {};

							service.createNewCategory = function(data) {
              				var newCategory = new Category();
              				newCategory.id = "" + data.id;
              				newCategory.name = data.name;
              				newCategory.parentCategory = new Category();
              				newCategory.parentCategory.id = "" + data.parentCategoryId;
              				newCategory.parentCategory.name = "";

              				return newCategory;
              			}

							service.saveNewCategory = function(newCategory) {
								var defer = $q.defer();
								debugger;
								var category = {
                              		"name" : newCategory.name,
                              		"parentCategory" : newCategory.parentCategory
                            }

                $http.post("http://localhost:8080/v1/categories/", category)
                     					.then(
                     						function(response) {
//                     					  console.log(JSON.stringify(response));
                                 $http.get("http://localhost:8080/v1/categories/" + response.data)
                                      .then(
                                         function(response) {
                                            var newCategory = service.createNewCategory(response.data);
                                            defer.resolve(newCategory);
                                         },
                                         function(response) {
                                           $translate('ERROR_CATEGORY_ADD', {name : newCategory.description})
                                            .then(function (message) {
                                              addAlert(message, response);
                                           });
                                         defer.reject();
                                         });
                     						},
                     						function(response) {
                     						  $translate('ERROR_CATEGORY_ADD', {name : newCategory.description})
                     						    .then(function (message) {
                     								  addAlert(message, response);
                     								});
                     							defer.reject();
                     						});
                     						return defer.promise;
                     };

						return service;

} ]);