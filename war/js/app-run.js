app
		.run(function($rootScope, $http, $translate, $q, googleService) {
			$rootScope.accountsURL = "/_ah/api/accountendpoint/v1/account/";
			$rootScope.categoriesURL = "/_ah/api/categoryendpoint/v1/category/";
			$rootScope.filtersURL = "_ah/api/transactionsfilterendpoint/v1/transactionsfilter/";
			$rootScope.logURL = "_ah/api/historyentryendpoint/v1/historyentry/";

			$rootScope.categories = [];
			$rootScope.accounts = [];
			$rootScope.filters = [];
			$rootScope.transactions = [];
			
			$rootScope.createNewCategory = function(data) {
				var newCategory = new Category();
				newCategory.id = data.id.id;
				newCategory.name = data.name;
				newCategory.parentCategory = new Category();
				newCategory.parentCategory.id = data.parentCategoryId;
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

				$http
						.get($rootScope.categoriesURL)
						.then(
								function(response) {
									$rootScope.categories = [];

									var data = response.data;
									if (data.items != null) {
										for (var i = 0; i < data.items.length; ++i) {
											var newCategory = $rootScope
													.createNewCategory(data.items[i]);
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
				newAccount.id = data.id;
				newAccount.name = data.name;
				newAccount.value = data.value;

				return newAccount;
			}

			$rootScope.refreshAccounts = function() {
				var defer = $q.defer();

				googleService.callScriptFunction("getAccounts")
				.then(
						function(response) {
							$rootScope.accounts = [];

							var data = response;

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

			$rootScope.refreshFilters = function() {
				var defer = $q.defer();

				$http.get($rootScope.filtersURL).then(function(response) {
					$rootScope.filters = [];

					var data = response.data;

					if (data.items != null) {
						for (var i = 0; i < data.items.length; ++i) {
							var newFilter = createNewFilter(data.items[i]);
							$rootScope.filters.push(newFilter);
						}
					}
					defer.resolve();
				}, function(response) {
					$translate('ERROR_DATA_RETRIVE').then(function(message) {
						addAlert(message, response);
					});
					defer.reject();
				});

				return defer.promise;
			}
			
			

		})
