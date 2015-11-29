app
		.controller(
				'transactionsController',
				function($scope, $rootScope, $http, $translate, $q,
						$stateParams, $state, $log, $mdDialog,
						transactionsService) {
					$scope.orderByField = 'date';
					$scope.reverseSort = false;
										
					$scope.newTransaction = new Transaction();

					$scope.transactionsFilter = function(transaction) {
						var dateFrom = $scope.selectedFilter.dateRange.startDate
								.format("YYYY-MM-DD");
						var dateTo = $scope.selectedFilter.dateRange.endDate
								.format("YYYY-MM-DD");

						if ($scope.selectedFilter.description != null
								&& $scope.selectedFilter.description !== ""
								&& (transaction.description == null || !(transaction.description
										.indexOf($scope.selectedFilter.description) > -1))) {
							return false;
						}

						if ($scope.selectedFilter.comment != null
								&& $scope.selectedFilter.comment !== ""
								&& (transaction.comment == null || !(transaction.comment
										.indexOf($scope.selectedFilter.comment) > -1))) {
							return false;
						}

						if ($scope.selectedFilter.priceFrom != null
								&& (transaction.price === null || !(transaction.price >= $scope.selectedFilter.priceFrom))) {
							return false;
						}

						if ($scope.selectedFilter.priceTo != null
								&& (transaction.price === null || !(transaction.price <= $scope.selectedFilter.priceTo))) {
							return false;
						}

						if ($scope.selectedFilter.accounts.length > 0
								&& (transaction.account.id === null || !($scope.selectedFilter.accounts
										.indexOf(transaction.account.id) > -1))) {
							return false;
						}

						// must be last checked condition
						if ($scope.selectedFilter.categories.length > 0
								&& (transaction.category.id === null || !($scope.selectedFilter.categories
										.indexOf(transaction.category.id) > -1))) {
							var tmpCategory = transaction.category.parentCategory;
							while (tmpCategory != null) { // if parent
															// category is
								// selected, all
								// children categories
								// should be also
								// visible
								if ($scope.selectedFilter.categories
										.indexOf(tmpCategory.id) > -1) {
									return true;
								}
								tmpCategory = tmpCategory.parentCategory;
							}

							return false;
						}

						return true;
					}

					$scope.addNewTransaction = function(id) {
						$scope.newTransaction.visible = true;
					}

					$scope.cancelAddNewTransaction = function() {
						$scope.newTransaction = new Transaction();
						$scope.newTransactionForm.$setPristine();
					}

					$scope.editTransaction = function(transaction) {
						transaction.editMode();
						transaction.copyForEdit.date = new Date(
								transaction.copyForEdit.date);
					};

					$scope.cancelEditTransaction = function(transaction) {
						transaction.readOnlyMode();
					};

					$scope.saveNewTransaction = function(transaction) {
						transactionsService.saveNewTransaction(transaction,
								$rootScope.accounts, $rootScope.categories)
								.then(function() {
									// $scope.newTransactionForm.$setPristine();
									$scope.newTransaction = new Transaction();

								});
					};

					$scope.saveTransaction = function(transaction) {
						transactionsService.saveTransaction(transaction,
								$rootScope.accounts, $rootScope.categories)
								.then(function() {
									transaction.readOnlyMode();
								});
					};

					$scope.removeTransaction = function(transaction) {
						transactionsService.removeTransaction(transaction,
								$rootScope.accounts, $rootScope.categories);
					};

					$rootScope.datePickerConfig = {
						"autoApply" : true,
						ranges : datePickerRanges,
						eventHandlers : {
							'apply.daterangepicker' : function(ev, picker) {
								$scope.refreshTransactions();
							}
						}
					};

					$q
							.all(
									[ $scope.refreshAccounts(),
											$scope.refreshCategories() ])
							.then(
									function() {
										transactionsService
												.refreshTransactions(
														$rootScope.accounts,
														$rootScope.categories)
												.then(
														function() {
															$rootScope.transactions = transactionsService.transactions;

														});
										
									});

				});