app
		.controller(
				'logController',
				function($scope, $rootScope, $http, $translate) {
					$scope.log = [];
					
					$scope.getLogEntries = function() {
						$http.get($rootScope.logURL).then(
								function(response) {
									var data = response.data;
									$scope.log = [];
									if (data.items != null) {
										for (i = 0; i < data.items.length; ++i) {
											$scope.log.push(data.items[i]);
										}
										
									} else {
										alert("No history entries found");
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(
											function(message) {
												addAlert(message, response);
											});
								});
					};


					$scope.getLogEntries();


				});