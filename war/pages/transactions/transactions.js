		app.controller(
				'transactionsController', 
				function($scope, $rootScope, $http, $translate, $q, $stateParams, $state) {
					$scope.orderByField = 'date';
					$scope.reverseSort = false;
					
					$scope.newTransaction = new Transaction();
					
					$scope.transactionsFilter = new TransactionsFilter();
					if ($stateParams.dateFrom != null){
						$scope.transactionsFilter.dateFrom = new Date($stateParams.dateFrom); 
					}
					if ($stateParams.dateTo != null){
						$scope.transactionsFilter.dateTo = new Date($stateParams.dateTo); 
					}
					if ($stateParams.descriptionContains != null){
						$scope.transactionsFilter.description = $stateParams.descriptionContains; 
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
						transaction.copyForEdit.date = new Date(transaction.copyForEdit.date);
					};

					$scope.cancelEditTransaction = function(transaction) {
						transaction.readOnlyMode();
					};

					function createNewTransaction(data){
						var newTransaction = new Transaction();
						newTransaction.id = data.id.id;
						newTransaction.date = new Date(data.date);
						newTransaction.description = data.description;
						newTransaction.comment = data.comment;
						newTransaction.category.id = data.categoryId;
						newTransaction.category.name = "";
						newTransaction.account.id = data.accountId;
						newTransaction.account.name = "";
						newTransaction.price = parseFloat(data.price);
						
						return newTransaction;
					}
					
					$scope.updateAccountAndCategoryReference = function(transaction) {
						for (var i = 0; i < $rootScope.categories.length; ++i) {
							existingCategory = $rootScope.categories[i];
							if (transaction.category.id === existingCategory.id) {
								transaction.category = existingCategory;
								break;
							}
						}
						
						for (var i = 0; i < $rootScope.accounts.length; ++i) {
							existingAccount = $rootScope.accounts[i];
							if (transaction.account.id === existingAccount.id) {
								transaction.account = existingAccount;
								break;
							}
						}
					}
					
					function convertDateToString(date){
						var dd = date.getDate();
						var mm = date.getMonth()+1; //January is 0!
						var yyyy = date.getFullYear();
						if(dd<10){dd='0'+dd};
						if(mm<10){mm='0'+mm};
						return "" + yyyy + "-" + mm + "-" + dd;
					}
					
					$scope.refreshTransactions = function() {
						dateFrom = $scope.transactionsFilter.dateFrom != null ? convertDateToString($scope.transactionsFilter.dateFrom) : null;
						dateTo = $scope.transactionsFilter.dateTo != null ? convertDateToString($scope.transactionsFilter.dateTo) : null;

						var url = $rootScope.transactionsURL + "?";
						url = dateFrom != null ? url + "dateFrom=" + dateFrom + "&" : url;
						url = dateTo != null ? url + "dateTo=" + dateTo + "&" : url;
						url = $scope.transactionsFilter.description != null ? url + "&descriptionContains=" + $scope.transactionsFilter.description + "&" : url;
						
						
						$state.transitionTo('transactions', {descriptionContains: $scope.transactionsFilter.description, dateFrom: dateFrom, dateTo: dateTo}, { notify: false });
						
						$http
						.get(url)
						.then(
								function(response) {
									$scope.transactions = [];
									
									var data = response.data;
									
									if (data.items != null){
										for (i = 0; i < data.items.length; ++i) {
											var newTransaction = createNewTransaction(data.items[i]);
											$scope.updateAccountAndCategoryReference(newTransaction);
											$scope.transactions.push(newTransaction);
										}
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
									    addAlert(message, response);
									  });
								});
					}

					$scope.removeTransaction = function(transactionToDelete) {
						$translate('CONFIRM_REMOVE_TRANSACTION', {name : transactionToDelete.name}).then(function (message) {
						bootbox 
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete($rootScope.transactionsURL + transactionToDelete.id)
											.then(
													function(response) {
														$scope.transactions.splice($scope.transactions.indexOf(transactionToDelete), 1); 
													},
													function(response) {
														$translate('ERROR_TRANSACTION_REMOVE', {name : transactionToDelete.name}).then(function (message) {
														    addAlert(message, response);
														  });
													});

										});
						});

					};
					
					$scope.saveNewTransaction = function(newTransaction) {

						var transaction = {
							"date" : newTransaction.date,
							"description" : newTransaction.description,
							"price" : newTransaction.price,
							"comment" : newTransaction.comment,
							"categoryId" : newTransaction.category.id,
        					"accountId" : newTransaction.account.id
						}
						
						$http
								.post($rootScope.transactionsURL,
										transaction)
								.then(
										function(response) {
											$scope.newTransaction = new Transaction();
											$scope.newTransactionForm.$setPristine();
											
											var newTransaction = createNewTransaction(response.data);
											$scope.updateAccountAndCategoryReference(newTransaction);
											$scope.transactions.push(newTransaction);
								
										},
										function(response) {
											$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};

					$scope.saveTransaction = function(editedTransaction) {
						var transaction = {
								"id" : {
									"id" : editedTransaction.id
								},
								"date" : editedTransaction.copyForEdit.date,
								"description" : editedTransaction.copyForEdit.description,
								"price" : editedTransaction.copyForEdit.price,
								"comment" : editedTransaction.copyForEdit.comment,
								"categoryId" : editedTransaction.copyForEdit.category.id,
	        					"accountId" : editedTransaction.copyForEdit.account.id
						}

						$http
								.put($rootScope.transactionsURL, transaction)
								.then(
										function(response) {
											editedTransaction.readOnlyMode();
											
											var updatedTransaction = createNewTransaction(response.data);
											$scope.updateAccountAndCategoryReference(updatedTransaction);
											$scope.transactions[$scope.transactions.indexOf(editedTransaction)] = updatedTransaction;
										},
										function(response) {
											$translate('ERROR_TRANSACTION_MODIFY', {name : editedTransaction.description}).then(function (message) {
											    addAlert(message, response);
											  });
										});
						
					};
					
					$(document).ready(function() {
						$q.all([$scope.refreshAccounts(), $scope.refreshCategories()])
						.then(function(){
							$scope.refreshTransactions();
						});
					});

				});