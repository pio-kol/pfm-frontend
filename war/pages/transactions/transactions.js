		app.controller(
				'transactionsController', 
				function($scope, $rootScope, $http, $translate, $q, $stateParams, $state, $log, $mdDialog, transactionsService) {
					$scope.orderByField = 'date';
					$scope.reverseSort = false;
					
					$scope.editFilter = function($event, filter){
						$mdDialog.show({
					          clickOutsideToClose: true,
					          controller: CategoryEditDialogController,
					          controllerAs: 'dialog',
					          locals: {
					              filters: $rootScope.filters,
					              selectedFilter: filter,
					              categories: $rootScope.categories,
					              accounts: $rootScope.accounts
					          },
					          templateUrl: 'pages/filters/editFiltersDialog.html',
					          bindToController: true,
					          targetEvent: $event
					        });
						
					
					}
					
					$scope.selectedTab = 1;
					// $scope.selectedFilter = defaultFilter;

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
					
					$scope.transactionsFilter = function(transaction) {
						var dateFrom = $scope.transactionsFilterState.dateRange.startDate.format("YYYY-MM-DD"); 
						var dateTo = $scope.transactionsFilterState.dateRange.endDate.format("YYYY-MM-DD");
						
						// $state.transitionTo('transactions',
						// {descriptionContains:
						// $scope.transactionsFilterState.description,
						// commentContains:
						// $scope.transactionsFilterState.comment, dateFrom:
						// dateFrom, dateTo: dateTo, priceFrom:
						// $scope.transactionsFilterState.priceRange.priceFrom,
						// priceTo:
						// $scope.transactionsFilterState.priceRange.priceTo,
						// accounts: $scope.transactionsFilterState.accounts,
						// categories:
						// $scope.transactionsFilterState.categories}, { notify:
						// false });
						
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
							while(tmpCategory != null){ // if parent category is
														// selected, all
														// children categories
														// should be also
														// visible
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

					$scope.saveNewTransaction = function(transaction){
						transactionsService.saveNewTransaction(transaction, $rootScope.accounts, $rootScope.categories)
						.then(function(){
							//$scope.newTransactionForm.$setPristine();
							$scope.newTransaction = new Transaction();
							
						});
					};
					
					$scope.saveTransaction = function(transaction){
						transactionsService.saveTransaction(transaction, $rootScope.accounts, $rootScope.categories)
						.then(function(){
							transaction.readOnlyMode();
						});
					};
					
					$scope.removeTransaction = function(transaction){
						transactionsService.removeTransaction(transaction, $rootScope.accounts, $rootScope.categories);
					};
					
					$rootScope.datePickerConfig = {
					"autoApply": true,
					ranges: datePickerRanges,
				    eventHandlers: {'apply.daterangepicker': function(ev, picker) { $scope.refreshTransactions(); }}
					};
					
						$q.all([$scope.refreshAccounts(), $scope.refreshCategories()])
						.then(function(){
							transactionsService.refreshTransactions($rootScope.accounts, $rootScope.categories)
							.then(function(){
									$rootScope.transactions = transactionsService.transactions;
								
							});
							$scope.refreshFilters().then(function(){
								
								if ($rootScope.filters.length == 0){
									var defaultFilter = new TransactionsFilter();
									defaultFilter.name = "Default"; 
									defaultFilter.id = "-1";
									  					
									$rootScope.filters.push(defaultFilter);
								}
								
								if ($stateParams.filter != null){
									alert($stateParams.filter);
								}
							});
						});

				});