app
		.factory(
				'transactionsService',
				[
						'$http', "$q", "$translate", 'googleService',
						function($http, $q, $translate, googleService) {
							var URL = "_ah/api/transactionendpoint/v1/transaction/";
							
							var service = {};
							service.transactions = [];
							
							updateAccountAndCategoryReference = function(transaction, accounts, categories) {
								for (var i = 0; i < categories.length; ++i) {
									existingCategory = categories[i];
									if (transaction.category.id === existingCategory.id) {
										transaction.category = existingCategory;
										break;
									}
								}
								
								for (var i = 0; i < accounts.length; ++i) {
									existingAccount = accounts[i];
									if (transaction.account.id === existingAccount.id) {
										transaction.account = existingAccount;
										break;
									}
								}
							}
							
							service.saveNewTransaction = function(newTransaction, accounts, categories) {
								var defer = $q.defer();
								
								var transaction = {
									"date" : newTransaction.date,
									"description" : newTransaction.description,
									"price" : newTransaction.price,
									"comment" : newTransaction.comment,
									"categoryId" : newTransaction.category.id,
		        					"accountId" : newTransaction.account.id
								}
								
								googleService.callScriptFunction("addTransaction", transaction)
										.then(
												function(response) {
													//alert(JSON.stringify(response));
													var newTransaction = createNewTransaction(response);
													updateAccountAndCategoryReference(newTransaction, accounts, categories);
													service.transactions.push(newTransaction);
													defer.resolve();
												},
												function(response) {
													$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description}).then(function (message) {
													    addAlert(message, response);
													  });
													defer.reject();
												});
								return defer.promise;
							};
							
							service.saveTransaction = function(editedTransaction, accounts, categories) {
								var defer = $q.defer();
								var transaction = {
										"id" : editedTransaction.id,
										"date" : editedTransaction.copyForEdit.date,
										"description" : editedTransaction.copyForEdit.description,
										"price" : editedTransaction.copyForEdit.price,
										"comment" : editedTransaction.copyForEdit.comment,
										"categoryId" : editedTransaction.copyForEdit.category.id,
			        					"accountId" : editedTransaction.copyForEdit.account.id
								}

								$http
										googleService.callScriptFunction("updateTransaction", transaction)
										.then(
												function(response) {
													var updatedTransaction = createNewTransaction(response);
													updateAccountAndCategoryReference(updatedTransaction, accounts, categories);
													service.transactions[service.transactions.indexOf(editedTransaction)] = updatedTransaction;
													defer.resolve();
												},
												function(response) {
													$translate('ERROR_TRANSACTION_MODIFY', {name : editedTransaction.description}).then(function (message) {
													    addAlert(message, response);
													  });
													defer.reject();
												});
								return defer.promise;
							};
							
							service.removeTransaction = function(transactionToDelete) {
								var defer = $q.defer();
								$translate('CONFIRM_REMOVE_TRANSACTION', {name : transactionToDelete.name}).then(function (message) {
								bootbox 
										.confirm(message,
												function(result) {
													if (!result) {
														return;
													}
													googleService.callScriptFunction("deleteTransaction", transactionToDelete.id)
													.then(
															function(response) {
																service.transactions.splice(service.transactions.indexOf(transactionToDelete), 1);
																defer.resolve();
															},
															function(response) {
																$translate('ERROR_TRANSACTION_REMOVE', {name : transactionToDelete.name}).then(function (message) {
																    addAlert(message, response);
																  });
																defer.reject();
															});

												});
								});
								return defer.promise;
							};
							
							service.refreshTransactions = function(accounts, categories) {
								var defer = $q.defer();
//								var dateFrom = $scope.selectedFilter.dateRange.startDate
//										.format("YYYY-MM-DD");
//								var dateTo = $scope.selectedFilter.dateRange.endDate
//										.format("YYYY-MM-DD");

								//var url = URL + "?";
//								url = dateFrom != null ? url + "dateFrom="
//										+ dateFrom + "&" : url;
//								url = dateTo != null ? url + "dateTo=" + dateTo
//										+ "&" : url;

								googleService.callScriptFunction("getTransactions")
										.then(
												function(response) {
													service.transactions = [];

													var data = response;

													if (data != null) {
														for (i = 0; i < data.length; ++i) {
															var newTransaction = createNewTransaction(data[i]);
														    updateAccountAndCategoryReference(newTransaction, accounts, categories);
															service.transactions.push(newTransaction);
														}
													}
													
													defer.resolve();
												},
												function(response) {
													$translate(
															'ERROR_DATA_RETRIVE')
															.then(
																	function(
																			message) {
																		addAlert(
																				message,
																				response);
																	});
													
													defer.reject();
												});
								
								return defer.promise;
							}
							
							return service;

						} ]);