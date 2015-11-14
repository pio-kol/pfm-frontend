app
		.config([
				'$translateProvider',
				'$stateProvider',
				'$urlRouterProvider',
				'$locationProvider',
				function($translateProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
					var translations_pl = {
						MAIN_CATEGORY : 'Kategoria główna',
						SAVE : 'Zapisz',
						CANCEL : 'Anuluj',
						DELETE : 'Usuń',
						EDIT : 'Edytuj',
						CATEGORY_NAME : 'Nazwa kategorii',
						ACCOUNT_NAME : 'Nazwa konta',
						PARENT_CATEGORY : 'Kategoria nadrzędna',
						REFRESH : 'Odśwież',
						NEW_CATEGORY : 'Nowa kategoria',
						NEW_ACCOUNT : 'Nowe konto',
						NEW_TRANSACTION : 'Nowa transakcja',
						ACCOUNT_STATE : 'Stan konta',
						LANGUAGE : 'PL',
						LOGIN : 'Zaloguj się',
						SIGN_UP : 'Utwórz konto',
						PAGE_TITLE : "Formularz wydatków",
						MENU_TRANSACTION_HISTORY : "Historia transakcji",
						MENU_ACCOUNTS : "Zarządzanie kontami",
						MENU_CATEGORIES : "Zarządzanie kategoriami",
						CONFIRM_REMOVE_CATEGORY : 'Kategoria "{{name}}" zostanie usunięta. Kontynuować?',
						CONFIRM_REMOVE_ACCOUNT : 'Konto "{{name}}" zostanie usunięte. Kontynuować?',
						CONFIRM_REMOVE_TRANSACTION : 'Tranzakcja "{{name}}" zostanie usunięta. Kontynuować?',
						ERROR_DATA_RETRIVE : "Nie udało się pobrać danych - spróbuj ponownie póżniej.",
						ERROR_CATEGORY_REMOVE : 'Nie udało się usunąć kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_CATEGORY_ADD : 'Nie udało się dodać kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_CATEGORY_MODIFY : 'Nie udało się zmodyfikować kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_REMOVE : 'Nie udało się usunąć konta "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_ADD : 'Nie udało się dodać konta "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_MODIFY : 'Nie udało się zmodyfikować konta "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_TRANSACTION_REMOVE : 'Nie udało się usunąć tranzakcji "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_TRANSACTION_ADD : 'Nie udało się dodać tranzakcji "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_TRANSACTION_MODIFY : 'Nie udało się zmodyfikować tranzakcji "{{name}}" - spróbuj ponownie póżniej.',
						TRANSACTION_DATE : "Data",
						TRANSACTION_DESCRIPTION : "Opis",
						TRANSACTION_CATEGORY : "Kategoria",
						TRANSACTION_ACCOUNT : "Konto",
						TRANSACTION_PRICE : "Cena",
						TRANSACTION_COMMENT : "Komentarz"
					};

					var translations_en = {
						MAIN_CATEGORY : 'Main category',
						SAVE : 'Save',
						CANCEL : 'Cancel',
						DELETE : 'Delete',
						EDIT : 'Edit',
						CATEGORY_NAME : 'Category name',
						ACCOUNT_NAME : 'Account name',
						PARENT_CATEGORY : 'Parent category',
						REFRESH : 'Refresh',
						NEW_CATEGORY : 'New category',
						NEW_ACCOUNT : 'New account',
						NEW_TRANSACTION : 'New transaction',
						ACCOUNT_STATE : 'Account state',
						LANGUAGE : 'EN',
						LOGIN : 'Login',
						SIGN_UP : 'Sign up',
						PAGE_TITLE : "Personal Finance Manager",
						MENU_TRANSACTION_HISTORY : "Transaction history",
						MENU_ACCOUNTS : "Accounts",
						MENU_CATEGORIES : "Categories",
						CONFIRM_REMOVE_CATEGORY : 'Category "{{name}}" will be removed. Continue?',
						CONFIRM_REMOVE_ACCOUNT : 'Account "{{name}}" will be removed. Continue?',
						CONFIRM_REMOVE_TRANSACTION : 'Transaction "{{name}}" will be removed. Continue?',
						ERROR_DATA_RETRIVE : "Not able to download data - please try again later.",
						ERROR_CATEGORY_REMOVE : 'Not able to delete category "{{name}}" - please try again later.',
						ERROR_CATEGORY_ADD : 'Not able to add category "{{name}}" - please try again later.',
						ERROR_CATEGORY_MODIFY : 'Not able to modify category "{{name}}" - please try again later.',
						ERROR_ACCOUNT_REMOVE : 'Not able to delete account "{{name}}" - please try again later.',
						ERROR_ACCOUNT_ADD : 'Not able to add account "{{name}}" - please try again later.',
						ERROR_ACCOUNT_MODIFY : 'Not able to modify account "{{name}}" - please try again later.',
						ERROR_TRANSACTION_REMOVE : 'Not able to delete transaction "{{name}}" - please try again later.',
						ERROR_TRANSACTION_ADD : 'Not able to add transaction "{{name}}" - please try again later.',
						ERROR_TRANSACTION_MODIFY : 'Not able to modify transaction "{{name}}" - please try again later.',
						TRANSACTION_DATE : "Date",
						TRANSACTION_DESCRIPTION : "Description",
						TRANSACTION_CATEGORY : "Category",
						TRANSACTION_ACCOUNT : "Account",
						TRANSACTION_PRICE : "Price",
						TRANSACTION_COMMENT : "Comment"
					};

					$translateProvider //
					.useSanitizeValueStrategy('escape') //
					.translations('pl', translations_pl) //
					.translations('en', translations_en) //
					.preferredLanguage('en');

					// $locationProvider.html5Mode(true);
					
					$urlRouterProvider.otherwise('/transactions');

					$stateProvider //
					.state("transactions", {
						url : "/transactions?dateFrom&dateTo&descriptionContains&priceFrom&priceTo&commentContains&accounts&categories",
						templateUrl : 'pages/transactions/transactions.html',
					})//
					.state("categories", {
						url : "/categories",
						templateUrl : 'pages/categories/categories.html'
					})//
					.state("accounts", {
						url : "/accounts",
						templateUrl : 'pages/accounts/accounts.html'
					})

				} ]);
