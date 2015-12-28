app
		.controller(
				'transactionsController',
				function($scope, $rootScope, $http, $translate, $q,
						$stateParams, $state, $log, $mdDialog,
						transactionsService) {
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
								transactionsService.refreshTransactions($rootScope.accounts, $rootScope.categories);
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