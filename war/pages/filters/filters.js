function CategoryEditDialogController($mdDialog, $http, $scope, $translate, filters, selectedFilter, categories, accounts) {
	var self = this;

	self.allFilters = filters;

	self.newFilter = JSON.parse(JSON.stringify(selectedFilter));
	self.newFilter.id = "";
	self.newFilter.name = "";

	self.selectedFilterId = null;

	self.filterToEdit = self.newFilter;

	self.selectionChanged = function() {
		if (self.selectedFilterId === "") {
			self.filterToEdit = self.newFilter;
			return;
		}
		for (var i = 0; i < filters.length; ++i) {
			if (filters[i].id === self.selectedFilterId) {
				self.filterToEdit = JSON.parse(JSON.stringify(filters[i]));
				return;
			}
		}
	}
	
	$scope.datePickerConfig = {
			"autoApply": true,
			ranges: datePickerRanges,
			};
	
	$scope.categories = categories;
	$scope.accounts = accounts;

	this.deleteFilter = function(){
		for (var i = 0; i < filters.length; ++i) {
			if (filters[i].id === self.selectedFilterId) {
				deleteSelectedFilter(filters[i]);
			}
		}
	}
	
	this.submit = function() {
		if (self.filterToEdit.id === "") {
			saveNewFilter(self.filterToEdit);
		}

		$mdDialog.hide();
	};
	
	saveNewFilter = function(newFilter){
		var filter = {
				"name" : newFilter.name,
				"categories" : newFilter.categories,
				"accounts" : newFilter.accounts,
				"dateFrom" : newFilter.dateRange.startDate,
				"dateTo" : newFilter.dateRange.endDate,
				"priceFrom" : newFilter.priceRange.priceFrom,
				"priceTo" : newFilter.priceRange.priceTo,
				"description" : newFilter.description,
				"comment" : newFilter.comment
			}
			
			$http
					.post("_ah/api/transactionsfilterendpoint/v1/transactionsfilter/", // $rootScope.transactionsFilterURL,
																						// //
																						// FIXME
							filter)
					.then(
							function(response) {
								var newFilter = createNewFilter(response.data);
								filters.push(newFilter);
							},
							function(response) { // FIXME message
								$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description}).then(function (message) { // FIXME
																																	// message
								    addAlert(message, response);
								  });
							});

	};
	
	deleteSelectedFilter = function(filterToDelete) {
		
							$http.delete("_ah/api/transactionsfilterendpoint/v1/transactionsfilter/" + filterToDelete.id)
							.then(
									function(response) {
										filters.splice(filters.indexOf(filterToDelete), 1); 
										$mdDialog.hide();
									},
									function(response) {
										$translate('ERROR_TRANSACTION_REMOVE', {name : filterToDelete.name}).then(function (message) {
										    addAlert(message, response);
										  });
									});
	};
}


