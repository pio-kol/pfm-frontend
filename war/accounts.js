angular
		.module('myApp', [])
		.controller(
				'accountController',
				function($scope) {

					$scope.accounts = [];

					$(document).ready(function() {
						$scope.refreshAccounts();
					});

					$scope.refreshAccounts = function() {
						try {
							$
									.getJSON(
											"https://formularz-wydatkow.appspot.com/_ah/api/accountendpoint/v1/account",
											function(data) {
												$scope.accounts = [];
												for (i = 0; i < data.items.length; ++i) {
													$scope.accounts
															.push({
																id : data.items[i].id.id,
																name : data.items[i].name,
																value : "1.00"
															});
												}

												$scope.accounts.sort(function(a, b) {
												    return a.name.localeCompare(b.name); 
												});
												$scope.$apply();
											});
						} catch (ex) {
							alert(ex);
						}
					}

					$scope.editAccount = function(id) {
						$("#accountRow_" + id + " > .editable").show();
						$("#accountRow_" + id + " > .readOnly").hide();
						$("#accountHeader > .editable").show();
						$("#accountHeader > .readOnly").hide();
					};

					$scope.removeAccount = function(id, name) {
						bootbox.confirm("Konto '" + name
								+ "' zostanie usuniete. Kontynuowac?",
								function(result) {
									if (result) {
										$("#accountRow_" + id).remove();
									}
								});
					};

					$scope.saveAccount = function(id) {
						$("#accountRow_" + id + " > .editable").hide();
						$("#accountRow_" + id + " > .readOnly").show();
						$("#accountHeader > .editable").hide();
						$("#accountHeader > .readOnly").show();
					};

				});