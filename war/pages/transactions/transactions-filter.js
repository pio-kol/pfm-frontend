app
		.filter(
				'transactionsFilter',
				function() {
					return function(transactions, selectedFilter) {
						var filteredTransactions = [];

						for (var i = 0; i < transactions.length; ++i) {
							transaction = transactions[i];

							var dateFrom = selectedFilter.dateRange.startDate
									.format("YYYY-MM-DD");
							var dateTo = selectedFilter.dateRange.endDate
									.format("YYYY-MM-DD");

							if (selectedFilter.description != null
									&& selectedFilter.description !== ""
									&& (transaction.description == null || !(transaction.description
											.toLowerCase().indexOf(
													selectedFilter.description
															.toLowerCase()) > -1))) {
								continue;
							}

							if (selectedFilter.comment != null
									&& selectedFilter.comment !== ""
									&& (transaction.comment == null || !(transaction.comment
											.toLowerCase().indexOf(
													selectedFilter.comment
															.toLowerCase()) > -1))) {
								continue;
							}

							if (selectedFilter.priceFrom != null
									&& (transaction.price === null || !(transaction.price >= selectedFilter.priceFrom))) {
								continue;
							}

							if (selectedFilter.priceTo != null
									&& (transaction.price === null || !(transaction.price <= selectedFilter.priceTo))) {
								continue;
							}

							if (selectedFilter.accounts.length > 0
									&& (transaction.account.id === null || !(selectedFilter.accounts
											.indexOf(transaction.account) > -1))) {
								continue;
							}

							// must be last checked condition
							if (selectedFilter.categories.length > 0
									&& (transaction.category.id === null || !(selectedFilter.categories
											.indexOf(transaction.category.id) > -1))) {
								var tmpCategory = transaction.category.parentCategory;
								while (tmpCategory != null) { // if parent
									// category is
									// selected, all
									// children categories
									// should be also
									// visible
									if (selectedFilter.categories
											.indexOf(tmpCategory.id) > -1) {
										filteredTransactions.push(transaction);
									}
									tmpCategory = tmpCategory.parentCategory;
								}

								continue;
							}

							filteredTransactions.push(transaction);
						}
						return filteredTransactions;
					}
					

				});
