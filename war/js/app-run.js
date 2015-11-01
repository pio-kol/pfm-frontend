app
		.run(function($rootScope, $http, $translate) {
			$rootScope.accountsURL = "/_ah/api/accountendpoint/v1/account/";
			$rootScope.categoriesURL = "/_ah/api/categoryendpoint/v1/category/";
			$rootScope.transactionsURL = "_ah/api/transactionendpoint/v1/transaction/";

			$rootScope.transactions = [];
			$rootScope.categories = [];
			$rootScope.accounts = [];

			$rootScope.createNewCategory = function(data) {
				var newCategory = new Category();
				newCategory.id = data.id.id;
				newCategory.name = data.name;
				newCategory.parentCategory = new Category();
				newCategory.parentCategory.id = data.parentCategory != null ? data.parentCategory.id.id
						: null;
				newCategory.parentCategory.name = data.parentCategory != null ? data.parentCategory.name
						: null;
				return newCategory;
			}

			$rootScope.refreshCategories = function() {

				$http.get($rootScope.categoriesURL).then(
						function(response) {
							$rootScope.categories = [];

							var data = response.data;
							if (data.items != null) {
								for (i = 0; i < data.items.length; ++i) {
									var newCategory = $rootScope
											.createNewCategory(data.items[i]);
									$rootScope.categories.push(newCategory);
								}
							}
						},
						function(response) {
							$translate('ERROR_DATA_RETRIVE').then(
									function(message) {
										addAlert(message, response);
									});
						});
			};

			$rootScope.refreshAccounts = function() {

				$http.get($rootScope.accountsURL).then(function(response) {
					$rootScope.accounts = [];

					var data = response.data;

					if (data.items != null) {
						for (i = 0; i < data.items.length; ++i) {
							var newAccount = new Account();
							newAccount.id = data.items[i].id.id;
							newAccount.name = data.items[i].name;
							newAccount.value = data.items[i].state;

							$rootScope.accounts.push(newAccount);
						}
					}
				}, function(response) {
					$translate('ERROR_DATA_RETRIVE').then(function(message) {
						addAlert(message, response);
					});
				});
			};

		})
