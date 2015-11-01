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

					$scope.cancelEditAccount = function(id) {
						getAccount(id).mode = "readOnly";
						$scope.refreshAccounts();
					};

					$scope.removeAccount = function(id, accountName) {
						$translate('CONFIRM_REMOVE_ACCOUNT', {name : accountName}).then(function (message) {
						bootbox
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete($rootScope.accountsURL + id)
											.then(
													function(response) {
														$scope.refreshAccounts();
													},
													function(response) {
														$translate('ERROR_ACCOUNT_REMOVE', {name : accountName}).then(function (message) {
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
											$scope.refreshAccounts();
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
											$scope.refreshAccounts();
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