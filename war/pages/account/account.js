var Account = function() {
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};

Account.prototype.clear = function() {
	this.name = "";
	this.value = "";
	this.visible = false;
	this.mode = 'readOnly';
};

app
		.controller(
				'accountController',
				function($scope, $http) {
					var URL = "/_ah/api/accountendpoint/v1/account/";

					$scope.accounts = [];
					$scope.newAccount = new Account();

					$scope.addNewAccount = function(id) {
						$scope.newAccount.visible = true;
					}

					$scope.cancelAddNewAccount = function() {
						$scope.newAccount.clear();
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

					$scope.refreshAccounts = function() {

						$http.get(URL)
						.then(
								function(response) {
									$scope.accounts = [];
									
									var data = response.data;
									for (i = 0; i < data.items.length; ++i) {
										var newAccount = new Account();
										newAccount.id = data.items[i].id.id;
										newAccount.name = data.items[i].name;
										newAccount.value = data.items[i].state;

										$scope.accounts.push(newAccount);
									}

									$scope.accounts
											.sort(function(a, b) {
												return a.name
														.localeCompare(b.name);
											});
								},
								function(response) {
									addAlert("Nie udało się pobrać danych - spróbuj ponownie póżniej. /n"
											+ "Status: "
											+ response.status
											+ ", Info: "
											+ response.data);
								});
					}

					$scope.removeAccount = function(id, name) {
						bootbox
								.confirm(
										"Konto <b>'"
												+ name
												+ "'</b> zostanie usuniete. Kontynuowac?",
										function(result) {
											if (!result) {
												return;
											}
											$http.delete(URL + id)
											.then(
													function(response) {
														$scope.refreshAccounts();
													},
													function(response) {
														addAlert("Nie udało się usunąć konta <b>'"
													+ name
													+ "'</b> - spróbuj ponownie póżniej. /n"
																+ "Status: "
																+ response.status
																+ ", Info: "
																+ response.data);
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
								.put(URL, account)
								.then(
										function(response) {
											editedAccount.mode = "readOnly";
											$scope.refreshAccounts();
										},
										function(response) {

											addAlert("Nie udało się zmodyfikować konta <b>'"
													+ editedAccount.name
													+ "'</b> - spróbuj ponownie póżniej. /n"
													+ "Status: "
													+ response.status
													+ ", Info: "
													+ response.data);
										});
					};

					$scope.saveNewAccount = function(newAccount) {
						var account = {
							"name" : newAccount.name,
							"state" : newAccount.value,
						}

						$http
								.post(URL, account)
								.then(
										function(response) {
											newAccount.clear();
											$scope.newAccountForm
													.$setPristine();
											$scope.refreshAccounts();
										},
										function(response) {
											addAlert("Nie udało się dodać nowego konta - spróbuj ponownie póżniej. /n"
													+ "Status: "
													+ response.status
													+ ", Info: "
													+ response.data);
										});

					};

					$(document).ready(function() {
						$scope.refreshAccounts();
					});

				});