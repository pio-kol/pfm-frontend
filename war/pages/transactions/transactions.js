		app.controller(
				'transactionsController', 
				function($scope, $http, $translate) {
					var URL = "_ah/api/entryendpoint/v1/entry/";

					$scope.newTransaction = new Transaction();
					
					$scope.addNewTransaction = function(id) {
						$scope.newTransaction.visible = true;
					}

					$scope.cancelAddNewTransaction = function() {
						$scope.newTransaction = new Transaction();
						$scope.newTransactionForm.$setPristine();
					}

					function getTransaction(id) {
						for (var i = 0; i < $scope.transactions.length; ++i) {
							var transaction = $scope.transactions[i];
							if (id == transaction.id) {
								return transaction;
							}
						}
					}

					$scope.editTransaction = function(id) {
						getTransaction(id).mode = "edit";
					};

					$scope.cancelEditTransaction = function(id) {
						getTransaction(id).mode = "readOnly";
						$scope.refreshTransactions();
					};

					$scope.refreshTransactions = function() {

						$http
						.get(URL)
						.then(
								function(response) {
									$scope.transactions = [];
									
									var data = response.data;
									
									if (data.items != null){
									for (i = 0; i < data.items.length; ++i) {
										var newTransaction = new Transaction();
										newTransaction.id = data.items[i].id.id;
										newTransaction.date = new Date(data.items[i].date);
										newTransaction.description = data.items[i].description;
										newTransaction.comment = data.items[i].comment;
										newTransaction.category.id = data.items[i].category != null ? data.items[i].category.id.id : null;
										newTransaction.category.name = data.items[i].category != null ? data.items[i].category.name : null;
										newTransaction.account.id = data.items[i].account != null ? data.items[i].account.id.id : null;
										newTransaction.account.name = data.items[i].account != null ? data.items[i].account.name : null;;
										newTransaction.price = parseFloat(data.items[i].price);
										
										$scope.transactions.push(newTransaction);
									}
									
									$scope.transactions.sort(function(a,b){
										  return a.date - b.date;
										});
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
									    addAlert(message, response);
									  });
								});
					}

					$scope.removeTransaction = function(id, transactionName) {
						$translate('CONFIRM_REMOVE_TRANSACTION', {name : transactionName}).then(function (message) {
						bootbox 
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete(URL + id)
											.then(
													function(response) {
														$scope.refreshTransactions();
													},
													function(response) {
														$translate('ERROR_TRANSACTION_REMOVE', {name : transactionName}).then(function (message) {
														    addAlert(message, response);
														  });
													});

										});
						});

					};

					$scope.saveNewTransaction = function(newTransaction) {

						var transaction = {
							"date" : newTransaction.date,
							"description" : newTransaction.description,
							"price" : newTransaction.price,
							"comment" : newTransaction.comment,
							"category" : {
							    "id": 
							    {
							      "id": newTransaction.category.id
							    }
							  },
							  "account" : {
								    "id": 
								    {
								      "id": newTransaction.account.id
								    }
								  }
						}


						$http
								.post(URL,
										transaction)
								.then(
										function(response) {
											$scope.newTransaction = new Transaction();
											$scope.newTransactionForm.$setPristine();
											$scope.refreshTransactions();
										},
										function(response) {
											$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};

					$scope.saveTransaction = function(editedTransaction) {
						var transaction = {
								"id" : {
									"id" : editedTransaction.id
								},
								"date" : editedTransaction.date,
								"description" : editedTransaction.description,
								"price" : editedTransaction.price,
								"comment" : editedTransaction.comment,
								"category" : {
								    "id": 
								    {
								      "id": editedTransaction.category.id
								    }
								  },
								  "account" : {
									    "id": 
									    {
									      "id": editedTransaction.account.id
									    }
									  }
						}

						$http
								.put(URL, transaction)
								.then(
										function(response) {
											editedTransaction.mode = "readOnly";
											$scope.refreshTransactions();
										},
										function(response) {
											$translate('ERROR_TRANSACTION_MODIFY', {name : editedTransaction.description}).then(function (message) {
											    addAlert(message, response);
											  });
										});

					};
					
					$(document).ready(function() {
						$scope.refreshAccounts();
						$scope.refreshCategories();
						$scope.refreshTransactions();
					});
					


				});