app
		.controller(
				'logController',
				function($scope, $rootScope, googleService, $translate) {
					$scope.log = [];
					
					$scope.getLogEntries = function() {
						googleService.callScriptFunction("getLog")
						.then(
								function(response) {
									var data = response;
									$scope.log = [];
									if (data != null) {
										for (i = 0; i < data.length; ++i) {
											$scope.log.push(data[i]);
										}
										
									} else {
										alert("No history entries found");
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE')
									.then(
											function(message) {
												addAlert(message, response);
											});
								});
					};


					$scope.getLogEntries();


				});