app
		.run(function($rootScope, $http, $translate) {
			$rootScope.transactions = [];
			$rootScope.categories = [];
			$rootScope.accounts = [];

			$rootScope.categoriesURL = "/_ah/api/categoryendpoint/v1/category/";
			$rootScope.refreshCategories = function() {

				$http
						.get($rootScope.categoriesURL)
						.then(
								function(response) {
									$rootScope.categories = [];

									var data = response.data;
									if (data.items != null) {
										for (i = 0; i < data.items.length; ++i) {
											var newCategory = new Category();
											newCategory.id = data.items[i].id.id;
											newCategory.name = data.items[i].name;
											newCategory.parentCategory = new Category();
											newCategory.parentCategory.id = data.items[i].parentCategory != null ? data.items[i].parentCategory.id.id
													: null;
											newCategory.parentCategory.name = data.items[i].parentCategory != null ? data.items[i].parentCategory.name
													: null;

											$rootScope.categories
													.push(newCategory);
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

			$rootScope.accountsURL = "/_ah/api/accountendpoint/v1/account/";
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

						$rootScope.accounts.sort(function(a, b) {
							return a.name.localeCompare(b.name);
						});
					}
				}, function(response) {
					$translate('ERROR_DATA_RETRIVE').then(function(message) {
						addAlert(message, response);
					});
				});
			};

		})
