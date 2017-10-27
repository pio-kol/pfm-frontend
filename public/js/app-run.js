app
		.run(function($rootScope, $http, $translate, $q, googleService) {
			$rootScope.categories = [];
			$rootScope.accounts = [];
			$rootScope.filters = [];
			$rootScope.transactions = [];
			
			$rootScope.createNewCategory = function(data) {
				var newCategory = new Category();
				newCategory.id = "" + data.id;
				newCategory.name = data.name;
				newCategory.parentCategory = new Category();
				newCategory.parentCategory.id = "" + data.parentCategoryId;
				newCategory.parentCategory.name = "";

				return newCategory;
			}

			$rootScope.updateParentCategoryReference = function(category) {
				if (category.parentCategory == null
						|| category.parentCategory.id == null) {
					return;
				}

				for (var i = 0; i < $rootScope.categories.length; ++i) {
					existingCategory = $rootScope.categories[i];
					if (category.parentCategory.id === existingCategory.id) {
						category.parentCategory = existingCategory;
						return;
					}
				}
			}

			$rootScope.refreshCategories = function() {
				var defer = $q.defer();

//        $rootScope.categories = [];
//
//        data={}
//        data.id=1
//        data.name='Car'
//        data.parentCategoryId=null
//
//        var newCategory = $rootScope.createNewCategory(data);
//        $rootScope.categories.push(newCategory);
//
//				defer.resolve();

				$http.get("http://localhost:8080/v1/categories/")
						.then(
								function(response) {
									$rootScope.categories = [];

									var data = response.data;
									if (data != null) {
										for (var i = 0; i < data.length; ++i) {
											var newCategory = $rootScope
													.createNewCategory(data[i]);
											$rootScope.categories
													.push(newCategory);
										}
										for (var i = 0; i < $rootScope.categories.length; ++i) {
											$rootScope
													.updateParentCategoryReference($rootScope.categories[i]);
										}

										defer.resolve();
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(
											function(message) {
												addAlert(message, response);
											});
									defer.reject();
								});

				return defer.promise;
			};

			$rootScope.createNewAccount = function(data) {
				var newAccount = new Account();
				newAccount.id = "" + data.id;
				newAccount.name = data.name;
				newAccount.value = data.value;

				return newAccount;
			}

			$rootScope.refreshAccounts = function() {
				var defer = $q.defer();

//        $rootScope.accounts = [];
//
//        data = {}
//        data.id=1
//        data.name='mBank'
//        data.value=127.16
//
//        var newAccount = $rootScope.createNewAccount(data);
//        $rootScope.accounts.push(newAccount);
//
//        defer.resolve();

				$http.get("http://localhost:8080/v1/accounts/")
				.then(
						function(response) {
							$rootScope.accounts = [];

							var data = response.data;

							if (data != null) {
								for (i = 0; i < data.length; ++i) {
									var newAccount = $rootScope
											.createNewAccount(data[i]);
									$rootScope.accounts.push(newAccount);
								}
							}
							defer.resolve();
						},
						function(response) {
							$translate('ERROR_DATA_RETRIVE').then(
									function(message) {
										addAlert(message, response);
									});
							defer.reject();
						});

				return defer.promise;
			};


		})
