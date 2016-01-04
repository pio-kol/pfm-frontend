app
		.controller(
				'transactionsController',
				function($scope, $rootScope, $http, $translate, $q,
						$stateParams, $state, $log, $mdDialog,
						transactionsService, filtersService) {
					$scope.orderByField = 'date';
					$scope.reverseSort = false;
										
					$scope.newTransaction = new Transaction();

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
									$rootScope.transactions.push(newTransaction);
									$scope.newTransaction = new Transaction();

								});
					};

					$scope.saveTransaction = function(editedTransaction) {
						transactionsService.saveTransaction(editedTransaction,
								$rootScope.accounts, $rootScope.categories)
								.then(function(updatedTransaction) {
									$rootScope.transactions[$rootScope.transactions.indexOf(editedTransaction)] = updatedTransaction;
									transaction.readOnlyMode();
								});
					};

					$scope.removeTransaction = function(transaction) {
						transactionsService.removeTransaction(transactionToDelete,
								$rootScope.accounts, $rootScope.categories)
								.then(function(){
									$rootScope.transactions.splice($rootScope.transactions.indexOf(transactionToDelete), 1);
								});
					};

					$rootScope.datePickerConfig = {
						"autoApply" : true,
						ranges : datePickerRanges,
						eventHandlers : {
							'apply.daterangepicker' : function(ev, picker) {
								transactionsService
								.refreshTransactions(
										$rootScope.accounts,
										$rootScope.categories,
										$rootScope.selectedFilter.dateRange)
								.then(
										function(transactions) {
											$rootScope.transactions = transactions;
										});
							}
						}
					};

					$q
							.all(
									[ $scope.refreshAccounts(),
											$scope.refreshCategories() ]) // TODO add cache support
											.then(
							function() {
								var defer = $q.defer();
								
								filtersService.refreshFilters($scope.accounts, $scope.categories, $rootScope.selectedFilter.dateRange)
								.then(function(filters) { 

									$rootScope.filters = filters;
									
									if ($rootScope.filters.length == 0) {
										var defaultFilter = new TransactionsFilter();
										defaultFilter.name = "Default";
										defaultFilter.id = "-1";

										$rootScope.filters.push(defaultFilter);
									}

									if ($stateParams.filter != null) {
										for (var i = 0; i < $rootScope.filters.length; ++i) {
											if ($stateParams.filter === $rootScope.filters[i].id) {
												$rootScope.filters[i].active = true;
												$rootScope.selectedFilter = $rootScope.filters[i]; 
											}
										}
									} else {
										$rootScope.filters[0].active = true;
										$rootScope.selectedFilter = $rootScope.filters[0];
									}
									
									defer.resolve();

								});
								
								return defer.promise;
							})

							.then(
									function() {
										transactionsService
												.refreshTransactions(
														$rootScope.accounts,
														$rootScope.categories,
														$rootScope.selectedFilter.dateRange)
												.then(
														function(transactions) {
															$rootScope.transactions = transactions;
														});
										
									});
					
					
					
					
				});