app
		.factory(
				'transactionsService',
				["$q", "$translate", 'googleService', '$http',
						function($q, $translate, googleService, $http) {
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
									"category" : newTransaction.category,
		        			"account" : newTransaction.account
								}
								
                $http.post("http://localhost:8080/v1/transactions/", transaction)
								  .then(
												function(response) {
													//alert(JSON.stringify(response));
                          $http.get("http://localhost:8080/v1/transactions/" + response.data)
                          .then(
                              function(response) {
                                  var newTransaction = createNewTransaction(response.data);
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
                									"date" : editedTransaction.copyForEdit.date,
                									"description" : editedTransaction.copyForEdit.description,
                									"price" : editedTransaction.copyForEdit.price,
                									"comment" : editedTransaction.copyForEdit.comment,
                									"category" : editedTransaction.copyForEdit.category,
                		        			"account" : editedTransaction.copyForEdit.account
                								}

//										googleService.callScriptFunction("updateTransaction", transaction)
                   $http.put("http://localhost:8080/v1/transactions/" + editedTransaction.id, transaction)
										.then(
										function(response) {
										$http.get("http://localhost:8080/v1/transactions/" + editedTransaction.id)
                                                    .then(
                                                        function(response) {
                                                            var newTransaction = createNewTransaction(response.data);
                                                            updateAccountAndCategoryReference(newTransaction, accounts, categories);

                                                            defer.resolve(newTransaction);
                                                        },
                                                        function(response) {
                                                            $translate('ERROR_TRANSACTION_ADD', {name : editedTransaction.description})
                                                            .then(function (message) {
                                                                addAlert(message, response);
                                                              });
                                                            defer.reject();
                                                    });
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
													$http.delete("http://localhost:8080/v1/transactions/"+transactionToDelete.id, transactionToDelete)
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

								$http.get("http://localhost:8080/v1/transactions/")
										.then(
												function(response) {
													var transactions = [];

													var data = response.data;

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