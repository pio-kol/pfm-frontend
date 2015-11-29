app
		.controller(
				'filtersController',
				function($scope, $rootScope, $http, $translate, $q,
						$stateParams, $state, $log, $mdDialog,
						transactionsService) {

					$scope.editFilter = function($event, filter) {
						$mdDialog
								.show({
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
						if (filter.id === 'new'){
							var newFilter = new TransactionsFilter(); // replace with copy
							newFilter.name = "??"
							newFilter.id = 'unsaved';
							$rootScope.filters.push(newFilter);
							$scope.selectedFilter = newFilter;
							return;
						} 
						
					$scope.selectedFilter = filter;
						$state
						.transitionTo(
								'transactions',
								{
									filter : $scope.selectedFilter.id
								}, {
									notify : false
								});
					}
					
					$rootScope.selectedFilter = new TransactionsFilter();


					$scope
					.refreshFilters()
					.then(
							function() {

								if ($rootScope.filters.length == 0) {
									var defaultFilter = new TransactionsFilter();
									defaultFilter.name = "Default";
									defaultFilter.id = "-1";

									$rootScope.filters
											.push(defaultFilter);
								}
								
								var newFilter = new TransactionsFilter();
								newFilter.name = "ZZZZZZZZZZZZZZZZZZZ"; // so it's last one
								newFilter.id = 'new';
								$rootScope.filters.push(newFilter);
								
								if ($stateParams.filter != null) {
									for (var i = 0; i < $rootScope.filters.length; ++i){
										if ($stateParams.filter === $rootScope.filters[i].id){
											$scope.selectedFilter = $rootScope.filters[i];
										}
									}
								}
								
								
							});

				});