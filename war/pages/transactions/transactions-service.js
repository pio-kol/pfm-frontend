app
		.factory(
				'transactionsService',
				[
						"$q", "$translate", 'googleService',
						function($q, $translate, googleService) { 
							var service = {};
							
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
													
													defer.resolve(newTransaction);
												},
												function(response) {
													$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description})
													.then(function (message) {
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
													
													defer.resolve(updatedTransaction);
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
							
							service.refreshTransactions = function(accounts, categories, dateRange) {
								var defer = $q.defer();

								var criteria = {
										"dateFrom" : dateRange.startDate,
										"dateTo" : dateRange.endDate,
								}

								googleService.callScriptFunction("getTransactions", criteria)
										.then(
												function(response) {
													var transactions = [];

													var data = response;

													if (data != null) {
														for (i = 0; i < data.length; ++i) {
															var newTransaction = createNewTransaction(data[i]);
														    updateAccountAndCategoryReference(newTransaction, accounts, categories);
															transactions.push(newTransaction);
														}
													}
													
													defer.resolve(transactions);
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