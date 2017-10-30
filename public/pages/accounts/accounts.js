app
		.controller(
				'accountController',
				function($scope, $rootScope, $http, $translate, googleService) {
					$scope.orderByField = 'name';
					$scope.reverseSort = false;
					
					$scope.newAccount = new Account();

					$scope.addNewAccount = function(id) {
						$scope.newAccount.visible = true;
					}

					$scope.cancelAddNewAccount = function() {
						$scope.newAccount = new Account();
						$scope.newAccountForm.$setPristine();
					}

					$scope.editAccount = function(account) {
						account.editMode();
					};

					$scope.cancelEditAccount = function(account) {
						account.readOnlyMode();
					};
					
					$scope.getAccountHistory = function(account) {
						googleService.callScriptFunction("getAccountHistory", account.id)
						.then(
								function(response) {
									var data = response;

									if (data != null) {
										var result = "";
										for (i = 0; i < data.length; ++i) {
											result += data[i].timestamp + " " + data[i].accountState + " " + data[i].transactionId + "\n";
										}
										alert(result);
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

					$scope.removeAccount = function(accountToDelete) {
						$translate('CONFIRM_REMOVE_ACCOUNT', {name : accountToDelete.name}).then(function (message) {
						bootbox
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											googleService.callScriptFunction("deleteAccount", accountToDelete.id)
											.then(
													function(response) {
														$scope.accounts.splice($scope.accounts.indexOf(accountToDelete), 1);
													},
													function(response) {
														$translate('ERROR_ACCOUNT_REMOVE', {name : accountToDelete.name}).then(function (message) {
														    addAlert(message, response);
														  });
													});
										});
						});
					};

					$scope.saveAccount = function(editedAccount) {
						var account = {
							"id" : editedAccount.id,
							"name" : editedAccount.copyForEdit.name,
							"value" : editedAccount.copyForEdit.value
						}

						googleService.callScriptFunction("updateAccount", account)
								.then(
										function(response) {
											editedAccount.readOnlyMode();

											var updatedAccount = $rootScope.createNewAccount(response);
											$scope.accounts[$scope.accounts.indexOf(editedAccount)] = updatedAccount;
										},
										function(response) {
											$translate('ERROR_ACCOUNT_MODIFY', {name : editedAccount.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});
					};

					$scope.saveNewAccount = function(newAccount) {
						var account = {
							"name" : newAccount.name,
							"value" : newAccount.value,
						}

//						googleService.callScriptFunction("addAccount", account)
						$http.post("http://localhost:8080/v1/accounts/", account)
								.then(
										function(response) {
											$scope.newAccount = new Account();
											$scope.newAccountForm
													.$setPristine();
											
											var newAccount = $rootScope.createNewAccount(response);
											$scope.accounts.push(newAccount);
											$scope.refreshAccounts();
										},
										function(response) {
											$translate('ERROR_ACCOUNT_ADD', {name : newAccount.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});



					};

					//$(document).ready(function() {
						$scope.refreshAccounts();
					//});

				});