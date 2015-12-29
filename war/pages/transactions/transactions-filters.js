app.controller('filtersController', function($scope, $rootScope, $http,
		$translate, $q, $stateParams, $state, $log, $mdDialog,
		transactionsService, googleService) {

	$scope.editFilter = function($event, filter) {
		$mdDialog.show({
			clickOutsideToClose : true,
			controller : CategoryEditDialogController,
			controllerAs : 'dialog',
			locals : {
				filters : $rootScope.filters,
				selectedFilter : filter,
				categories : $rootScope.categories,
				accounts : $rootScope.accounts
			},
			templateUrl : 'pages/filters/editFiltersDialog.html',
			bindToController : true,
			targetEvent : $event
		});

	}

	$scope.applyFilter = function(filter) {

		$scope.selectedFilter = filter;
		$state.transitionTo('transactions', {
			filter : $scope.selectedFilter.id
		}, {
			notify : false
		});
	}


	$scope.addNewFilter = function() {
		var newFilter = $scope.selectedFilter;
		
		var filter = {
			"name" : "( New filter )",
			"categories" : [],
			"accounts" : [],
			"dateFrom" : newFilter.dateRange.startDate,
			"dateTo" : newFilter.dateRange.endDate,
			"priceFrom" : newFilter.priceFrom,
			"priceTo" : newFilter.priceTo,
			"description" : newFilter.description,
			"comment" : newFilter.comment
		}

		for (var i = 0; i < newFilter.accounts.length; ++i) {
			filter.accounts.push(newFilter.accounts[i].id);
		}

		for (var i = 0; i < newFilter.categories.length; ++i) {
			filter.categories.push(newFilter.categories[i].id);
		}

		googleService.callScriptFunction("addFilter", filter)
		.then(
				function(response) {
					var newFilter = createNewFilter(response);
					newFilter.name = "( New filter )"
					newFilter.active = true;
					$rootScope.filters.push(newFilter);
					$scope.selectedFilter.active = false; // previous one
					$scope.selectedFilter = newFilter;
				}, function(response) { // FIXME message
					$translate('ERROR_TRANSACTION_ADD', {
						name : newFilter.description
					}).then(function(message) { // FIXME
						// message
						addAlert(message, response);
					});
				});

	};
	

	$rootScope.saveEditedFilter = function(newName){
		var editedFilter = $scope.selectedFilter;
		
		// callback is called before editing model (inline-edit)
		if (newName != null){
			editedFilter.name = newName;
		}
		
		var filter = {
				"id" : editedFilter.id,
				"name" : editedFilter.name,
				"categories" : [],
				"accounts" : [],
				"dateFrom" : editedFilter.dateRange.startDate,
				"dateTo" : editedFilter.dateRange.endDate,
				"priceFrom" : editedFilter.priceFrom,
				"priceTo" : editedFilter.priceTo,
				"description" : editedFilter.description,
				"comment" : editedFilter.comment
			}
		
		for (var i=0; i < editedFilter.accounts.length; ++i){
			filter.accounts.push(editedFilter.accounts[i].id);
		}
		
		for (var i=0; i < editedFilter.categories.length; ++i){
			filter.categories.push(editedFilter.categories[i].id);
		}
			
		googleService.callScriptFunction("updateFilter", filter)
					.then(
							function(response) {
								var updatedFilter = createNewFilter(response.data);
								//alert(updatedFilter.name);
								//filters[filters.indexOf(originalFilter)] = updatedFilter;
								// FIXME add update of model
								
							},
							function(response) { // FIXME message
								$translate('ERROR_TRANSACTION_ADD', {name : filter.name}).then(function (message) { 
								    addAlert(message, response);
								  });
							});

	};
	
	$scope.deleteSelectedFilter = function() {
		var filterToDelete = $scope.selectedFilter;
		
		googleService.callScriptFunction("deleteFilter", filterToDelete.id)
		.then(
				function(response) {
					$rootScope.filters.splice($rootScope.filters.indexOf(filterToDelete), 1); 
	//				$mdDialog.hide();
				},
				function(response) {
					$translate('ERROR_TRANSACTION_REMOVE', {name : filterToDelete.name}).then(function (message) {
					    addAlert(message, response);
					  });
				});
	};
	
	var createNewFilter = function(item) {
		var filter = new TransactionsFilter();
		filter.id = item.id;
		filter.name = item.name;
		if (item.categories != null){
			for (var i = 0; i < item.categories.length; ++i) {
				filter.categories.push(item.categories[i]);
			}
		}
		if (item.accounts != null){
			for (var i = 0; i < item.accounts.length; ++i) {
				filter.accounts.push(item.accounts[i]);
			}
		}
		filter.dateRange.startDate = moment(item.dateFrom);
		filter.dateRange.endDate = moment(item.dateTo);
		filter.description = item.description;
		filter.priceFrom = parseFloat(item.priceFrom);
		filter.priceTo = parseFloat(item.priceTo);
		filter.comment = item.comment;
		
		return filter;
	}

	$rootScope.selectedFilter = new TransactionsFilter();

	$scope.refreshFilters().then(function() {

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
				}
			}
		} else {
			$rootScope.filters[0].active = true;
		}

	});

});