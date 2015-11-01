		app.controller(
				'transactionsController', 
				function($scope, $http, $translate) {
					var URL = "_ah/api/transactionendpoint/v1/transaction/";
					
					$scope.orderByField = 'date';
					$scope.reverseSort = false;

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

					function createNewTransaction(data){
						var newTransaction = new Transaction();
						newTransaction.id = data.id.id;
						newTransaction.date = new Date(data.date);
						newTransaction.description = data.description;
						newTransaction.comment = data.comment;
						newTransaction.category.id = data.category != null ? data.category.id.id : null;
						newTransaction.category.name = data.category != null ? data.category.name : null;
						newTransaction.account.id = data.account != null ? data.account.id.id : null;
						newTransaction.account.name = data.account != null ? data.account.name : null;;
						newTransaction.price = parseFloat(data.price);
						
						return newTransaction;
					}
					
					$scope.cancelEditTransaction = function(editedTransaction) {
						$http
						.get(URL + editedTransaction.id)
						.then(
								function(response) {
									var transactionFromServer = createNewTransaction(response.data);
									$scope.transactions[$scope.transactions.indexOf(editedTransaction)] = transactionFromServer;

									getTransaction(editedTransaction.id).mode = "readOnly";
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
									    addAlert(message, response);
									  });
								});
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
										var newTransaction = createNewTransaction(data.items[i]);
										$scope.transactions.push(newTransaction);
									}
									}
								},
								function(response) {
									$translate('ERROR_DATA_RETRIVE').then(function (message) {
									    addAlert(message, response);
									  });
								});
					}

					$scope.removeTransaction = function(transactionToDelete) {
						$translate('CONFIRM_REMOVE_TRANSACTION', {name : transactionToDelete.name}).then(function (message) {
						bootbox 
								.confirm(message,
										function(result) {
											if (!result) {
												return;
											}
											$http.delete(URL + transactionToDelete.id)
											.then(
													function(response) {
														$scope.transactions.splice($scope.transactions.indexOf(transactionToDelete), 1); 
													},
													function(response) {
														$translate('ERROR_TRANSACTION_REMOVE', {name : transactionToDelete.name}).then(function (message) {
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
											
											var newTransaction = createNewTransaction(response.data);
											$scope.transactions.push(newTransaction);
								
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
											
											var updatedTransaction = createNewTransaction(response.data);
											$scope.transactions[$scope.transactions.indexOf(editedTransaction)] = updatedTransaction;
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