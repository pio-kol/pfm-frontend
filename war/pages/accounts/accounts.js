app
		.controller(
				'accountController',
				function($scope, $rootScope, $http, $translate) {
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

					function getAccount(id) {
						for (var i = 0; i < $scope.accounts.length; ++i) {
							var account = $scope.accounts[i];
							if (id == account.id) {
								return account;
							}
						}
					}

					$scope.editAccount = function(id) {
						getAccount(id).mode = "edit";
					};

					$scope.cancelEditAccount = function(editedAccount) {
						$http
						.get($rootScope.accountsURL + editedAccount.id)
						.then(
								function(response) {
									var accountFromServer = $rootScope.createNewAccount(response.data);
									$scope.accounts[$scope.accounts.indexOf(editedAccount)] = accountFromServer;

									getAccount(editedAccount.id).mode = "readOnly";
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
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
											$http.delete($rootScope.accountsURL + accountToDelete.id)
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
							"id" : {
								"id" : editedAccount.id
							},
							"name" : editedAccount.name,
							"state" : editedAccount.value
						}

						$http
								.put($rootScope.accountsURL, account)
								.then(
										function(response) {
											editedAccount.mode = "readOnly";

											var updatedAccount = $rootScope.createNewAccount(response.data);
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
							"state" : newAccount.value,
						}

						$http
								.post($rootScope.accountsURL, account)
								.then(
										function(response) {
											$scope.newAccount = new Account();
											$scope.newAccountForm
													.$setPristine();
											
											var newAccount = $rootScope.createNewAccount(response.data);
											$scope.accounts.push(newAccount);
										},
										function(response) {
											$translate('ERROR_ACCOUNT_ADD', {name : newAccount.name}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};

					$(document).ready(function() {
						$scope.refreshAccounts();
					});

				});