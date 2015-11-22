		app.controller(
				'transactionsController', 
				function($scope, $rootScope, $http, $translate, $q, $stateParams, $state, $log, $mdDialog) {
					$scope.orderByField = 'date';
					$scope.reverseSort = false;
					
					$scope.editFilter = function($event, filter){
						$mdDialog.show({
					          clickOutsideToClose: true,
					          controller: CategoryEditDialogController,
					          controllerAs: 'dialog',
					          locals: {
					              filters: $rootScope.transactionsFilters,
					              selectedFilter: filter,
					              categories: $rootScope.categories,
					              accounts: $rootScope.accounts
					          },
					          templateUrl: 'pages/filters/editFiltersDialog.html',
					          bindToController: true,
					          targetEvent: $event
					        });
						
					
					}
					
					  					
					$rootScope.transactionsFilters = [];
					$scope.selectedTab = 1;

					$scope.getTransactionsFilters = function() {

						$http
								.get($rootScope.transactionsFilterURL)
								.then(
										function(response) {
											$rootScope.transactionsFilters = [];
											
											var filter = new TransactionsFilter();
											filter.name = "This month"; 
											filter.id = "-1";
											
											$rootScope.transactionsFilters.push(filter); 

											var data = response.data;

											if (data.items != null) {
												for (var i = 0; i < data.items.length; ++i) {
													var newFilter = createNewFilter(data.items[i]);
													$scope.transactionsFilters
															.push(newFilter);
												}
											}
										},
										function(response) {
											$translate('ERROR_DATA_RETRIVE')
													.then(
															function(message) {
																addAlert(
																		message,
																		response);
															});
										});
					}

					$scope.applyFilter = function(filter){
						$scope.transactionsFilterState = filter;
						$scope.priceRangeChoiceOptions.push(filter.priceRange)
					}
					
					$scope.newTransaction = new Transaction();
					$rootScope.transactionsFilterState = new TransactionsFilter();
					
					$scope.priceRangeChoiceOptions = [];
					// to make value selected by default
					$scope.priceRangeChoiceOptions.push($scope.transactionsFilterState.priceRange); 
					$scope.priceRangeChoiceOptions.push({description : "Income", priceFrom : null, priceTo : 0});
					$scope.priceRangeChoiceOptions.push({description : "Income > 1000", priceFrom : -1000, priceTo : 0});
					$scope.priceRangeChoiceOptions.push({description : "Spending", priceFrom : 0, priceTo : null});
					$scope.priceRangeChoiceOptions.push({description : "Spending <0, 100>", priceFrom : 0, priceTo : 100});
					$scope.priceRangeChoiceOptions.push({description : "Spending > 100", priceFrom : 100, priceTo : null});
					
					if ($stateParams.filterId != null){
						$scope.transactionsFilterState.dateRange.startDate = moment($stateParams.dateFrom); 
					}
					if ($stateParams.dateTo != null){
						$scope.transactionsFilterState.dateRange.endDate = moment($stateParams.dateTo); 
					}
					if ($stateParams.descriptionContains != null){
						$scope.transactionsFilterState.description = $stateParams.descriptionContains; 
					}
					
					if ($stateParams.priceFrom != null && $stateParams.priceTo != null){
						$scope.transactionsFilterState.priceRange = {description : "Custom <" + $stateParams.priceFrom +  ", " + $stateParams.priceTo + ">", priceFrom : parseFloat($stateParams.priceFrom), priceTo : parseFloat($stateParams.priceTo)} 
						$scope.priceRangeChoiceOptions.push($scope.transactionsFilterState.priceRange); 
					} else if ($stateParams.priceFrom != null){
						$scope.transactionsFilterState.priceRange = {description : "Custom > " + $stateParams.priceFrom, priceFrom : parseFloat($stateParams.priceFrom), priceTo : null} 
						$scope.priceRangeChoiceOptions.push($scope.transactionsFilterState.priceRange); 
					} else if ($stateParams.priceTo != null){
						$scope.transactionsFilterState.priceRange = {description : "Custom < " + $stateParams.priceTo, priceFrom : null, priceTo : parseFloat($stateParams.priceTo)} 
						$scope.priceRangeChoiceOptions.push($scope.transactionsFilterState.priceRange); 
					}
					if ($stateParams.commentContains != null){
						$scope.transactionsFilterState.comment = $stateParams.commentContains; 
					}
					if ($stateParams.accounts != null){
						if(typeof $stateParams.accounts === 'string' ) {
							$scope.transactionsFilterState.accounts.push($stateParams.accounts); 
						} else { // array
							$scope.transactionsFilterState.accounts = $stateParams.accounts;
						}
					}
					if ($stateParams.categories != null){
						if(typeof $stateParams.categories === 'string' ) {
							$scope.transactionsFilterState.categories.push($stateParams.categories); 
						} else { // array
							$scope.transactionsFilterState.categories = $stateParams.categories;
						}
					}
					
					$scope.transactionsFilter = function(transaction) {
						var dateFrom = $scope.transactionsFilterState.dateRange.startDate.format("YYYY-MM-DD"); 
						var dateTo = $scope.transactionsFilterState.dateRange.endDate.format("YYYY-MM-DD");
						
						$state.transitionTo('transactions', {descriptionContains: $scope.transactionsFilterState.description, commentContains: $scope.transactionsFilterState.comment, dateFrom: dateFrom, dateTo: dateTo, priceFrom: $scope.transactionsFilterState.priceRange.priceFrom, priceTo: $scope.transactionsFilterState.priceRange.priceTo, accounts: $scope.transactionsFilterState.accounts, categories: $scope.transactionsFilterState.categories}, { notify: false });
						
						if ($scope.transactionsFilterState.description != null && $scope.transactionsFilterState.description !== "" &&
								(transaction.description == null || !(transaction.description.indexOf($scope.transactionsFilterState.description) > -1))){
								return false;
						}
						
						if ($scope.transactionsFilterState.comment != null && $scope.transactionsFilterState.comment !== "" && 
								(transaction.comment == null ||	!(transaction.comment.indexOf($scope.transactionsFilterState.comment) > -1))){
									return false;
						}
						
						if ($scope.transactionsFilterState.priceRange.priceFrom !== null && 
								(transaction.price === null || !(transaction.price >= $scope.transactionsFilterState.priceRange.priceFrom))){
									return false;
						}
						
						if ($scope.transactionsFilterState.priceRange.priceTo !== null && 
								(transaction.price === null || !(transaction.price <= $scope.transactionsFilterState.priceRange.priceTo))){
									return false;
						}
						
						if ($scope.transactionsFilterState.accounts.length > 0 && 
								(transaction.account.id === null || !($scope.transactionsFilterState.accounts.indexOf(transaction.account.id) > -1))){
									return false;
						}
						
						// must be last checked condition
						if ($scope.transactionsFilterState.categories.length > 0 && 
								(transaction.category.id === null || !($scope.transactionsFilterState.categories.indexOf(transaction.category.id) > -1))){
							var tmpCategory = transaction.category.parentCategory;
							while(tmpCategory != null){ // if parent category is selected, all children categories should be also visible
								if($scope.transactionsFilterState.categories.indexOf(tmpCategory.id) > -1){
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
					
					$scope.refreshTransactions = function() {
						var dateFrom = $scope.transactionsFilterState.dateRange.startDate.format("YYYY-MM-DD"); 
						var dateTo = $scope.transactionsFilterState.dateRange.endDate.format("YYYY-MM-DD");

						var url = $rootScope.transactionsURL + "?";
						url = dateFrom != null ? url + "dateFrom=" + dateFrom + "&" : url;
						url = dateTo != null ? url + "dateTo=" + dateTo + "&" : url;
						
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
					
					
					$rootScope.datePickerConfig = {
					"autoApply": true,
					ranges: datePickerRanges,
				    eventHandlers: {'apply.daterangepicker': function(ev, picker) { $scope.refreshTransactions(); }}
					};
					
					$(document).ready(function() {
						$q.all([$scope.refreshAccounts(), $scope.refreshCategories()])
						.then(function(){
							$scope.refreshTransactions();
							$scope.getTransactionsFilters();
						});
					});

				});