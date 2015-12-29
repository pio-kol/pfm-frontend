function CategoryEditDialogController($mdDialog, $http, $scope, $translate, filters, selectedFilter, categories, accounts) {
	var self = this;

	self.allFilters = filters;

	self.newFilter = JSON.parse(JSON.stringify(selectedFilter));
	self.newFilter.priceFrom = parseFloat(self.newFilter.priceFrom);
	self.newFilter.priceTo = parseFloat(self.newFilter.priceTo);
	self.newFilter.id = "";
	self.newFilter.name = "";

	self.selectedFilterId = null;

	self.filterToEdit = self.newFilter;
	self.selectedFilter = self.newFilter;

	self.selectionChanged = function() {
		if (self.selectedFilterId === "") {
			self.filterToEdit = self.newFilter;
			return;
		}
		for (var i = 0; i < filters.length; ++i) {
			if (filters[i].id === self.selectedFilterId) {
				self.filterToEdit = JSON.parse(JSON.stringify(filters[i]));
				self.filterToEdit.priceFrom = parseFloat(self.filterToEdit.priceFrom);
				self.filterToEdit.priceTo = parseFloat(self.filterToEdit.priceTo);
				self.selectedFilter = filters[i];
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
		} else {
			saveEditedFilter(self.filterToEdit, self.selectedFilter);
		}

		$mdDialog.hide();
	};
	
	saveNewFilter = function(newFilter){
		var filter = {
				"name" : newFilter.name,
				"categories" : [],
				"accounts" : [],
				"dateFrom" : newFilter.dateRange.startDate,
				"dateTo" : newFilter.dateRange.endDate,
				"priceFrom" : newFilter.priceFrom,
				"priceTo" : newFilter.priceTo,
				"description" : newFilter.description,
				"comment" : newFilter.comment
			}
		
		for (var i=0; i < editedFilter.accounts.length; ++i){
			filter.accounts.push(editedFilter.accounts[i].id);
		}
		
		for (var i=0; i < editedFilter.categories.length; ++i){
			filter.categories.push(editedFilter.categories[i].id);
		}
			
			googleService.callScriptFunction("addFilter", filter)
					.then(
							function(response) {
								var newFilter = createNewFilter(response.data);
								filters.push(newFilter);
							},
							function(response) { // FIXME message
								$translate('ERROR_TRANSACTION_ADD', {name : newFilter.description}).then(function (message) { // FIXME
																																	// message
								    addAlert(message, response);
								  });
							});

	};
	
	saveEditedFilter = function(editedFilter, originalFilter){
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
								filters[filters.indexOf(originalFilter)] = updatedFilter;
								
							},
							function(response) { // FIXME message
								$translate('ERROR_TRANSACTION_ADD', {name : originalFilter.name}).then(function (message) { 
								    addAlert(message, response);
								  });
							});

	};
	
	deleteSelectedFilter = function(filterToDelete) {
		
						googleService.callScriptFunction("deleteFilter", filterToDelete.id)
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
	
	self.searchTextCategories = "";
	self.searchTextAccounts = "";
    self.querySearchCategories = querySearchCategories;
    self.querySearchAccounts = querySearchAccounts;
   
   
    function querySearchCategories(query) {
        var results = query ? categories.filter(createFilterFor(query)) : [];
        return results;
      }
    
    function querySearchAccounts(query) {
      var results = query ? accounts.filter(createFilterFor(query)) : [];
      return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(account) {
        return (account.name.toLowerCase().indexOf(lowercaseQuery) != -1);
      };

    }
    
}


