app.controller('filtersController', function($scope, $rootScope, $http,
		$translate, $q, $stateParams, $state, $log, $mdDialog,
		transactionsService, filtersService, googleService) {

	$scope.applyFilter = function(filter) {

		$rootScope.selectedFilter = filter;
		$rootScope.transactions = [];
		
		$state.transitionTo('transactions', {
			filter : $rootScope.selectedFilter.id
		}, {
			notify : false
		});
		
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

	$rootScope.selectedFilter = new TransactionsFilter();

	$scope.addNewFilter = function() {
		var newFilter = $rootScope.selectedFilter;
		
		filtersService.addNewFilter(newFilter)
		.then(function(newFilter){
			//var newFilter = createNewFilter(response);
			//newFilter.name = "( New filter )"
			newFilter.active = true;
			$scope.filters.push(newFilter);
			
			$rootScope.selectedFilter.active = false; // previous one
			$rootScope.selectedFilter = newFilter;
		});

	};
	

	$scope.saveEditedFilter = function(newName){
		var editedFilter = $rootScope.selectedFilter;
		
		// callback is called before editing model (inline-edit)
		if (newName != null){
			editedFilter.name = newName;
		}
		
		filtersService.saveEditedFilter(editedFilter, $scope.accounts, $scope.categories)
					.then(
							function(filter) {
								// alert(updatedFilter.name);
								//filters[filters.indexOf(originalFilter)] = updatedFilter;
								// FIXME add update of model
								
							});
	};
	
	$scope.deleteSelectedFilter = function() {
		var filterToDelete = $rootScope.selectedFilter;
		
		filtersService.deleteFilter(filterToDelete)
		.then(
				function(response) {
					$rootScope.filters.splice($rootScope.filters.indexOf(filterToDelete), 1); 
				});
	};
	

});