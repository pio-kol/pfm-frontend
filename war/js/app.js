var app = angular.module('myApp', [ 'angular.chosen', 'pascalprecht.translate',
		'ngSanitize', 'ui.router' ]);

app
		.config([
				'$translateProvider',
				'$stateProvider',
				'$urlRouterProvider',
				function($translateProvider, $stateProvider, $urlRouterProvider) {
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
						ACCOUNT_STATE : 'Stan konta',
						LANGUAGE : 'PL',
						LOGIN : 'Zaloguj się',
						SIGN_UP : 'Utwórz konto',
						PAGE_TITLE : "Formularz wydatkow",
						MENU_TRANSACTION_HISTORY : "Historia transakcji",
						MENU_ACCOUNTS : "Zarządzanie kontami",
						MENU_CATEGORIES : "Zarządzanie kategoriami",
						CONFIRM_REMOVE_CATEGORY : 'Kategoria "{{name}}" zostanie usunięta. Kontynuować?', 
						CONFIRM_REMOVE_ACCOUNT : 'Konto "{{name}}" zostanie usunięte. Kontynuować?',
						ERROR_DATA_RETRIVE : "Nie udało się pobrać danych - spróbuj ponownie póżniej.",
						ERROR_CATEGORY_REMOVE : 'Nie udało się usunąć kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_CATEGORY_ADD : 'Nie udało się dodać kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_CATEGORY_MODIFY : 'Nie udało się zmodyfikować kategorii "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_REMOVE : 'Nie udało się usunąć konta "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_ADD : 'Nie udało się dodać konta "{{name}}" - spróbuj ponownie póżniej.',
						ERROR_ACCOUNT_MODIFY : 'Nie udało się zmodyfikować konta "{{name}}" - spróbuj ponownie póżniej.'
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
						NEW_ACCOUNT : 'New acount',
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
						ERROR_DATA_RETRIVE : "Not able to download data - please try again later.",
						ERROR_CATEGORY_REMOVE : 'Not able to delete category "{{name}}" - please try again later.',
						ERROR_CATEGORY_ADD : 'Not able to add category "{{name}}" - please try again later.',
						ERROR_CATEGORY_MODIFY : 'Not able to modify category "{{name}}" - please try again later.',
						ERROR_ACCOUNT_REMOVE : 'Not able to delete account "{{name}}" - please try again later.',
						ERROR_ACCOUNT_ADD : 'Not able to add account "{{name}}" - please try again later.',
						ERROR_ACCOUNT_MODIFY : 'Not able to modify account "{{name}}" - please try again later.'
					};

					$translateProvider //
					.useSanitizeValueStrategy('escape') //
					.translations('pl', translations_pl) //
					.translations('en', translations_en) //
					.preferredLanguage('en');

					$urlRouterProvider.otherwise('/transactions');

					$stateProvider //
					.state("transactions", {
						url : "/transactions",
						templateUrl : 'pages/transactions/transactions.html'
					})//
					.state("categories", {
						url : "/categories",
						templateUrl : 'pages/category/category.html'
					})//
					.state("accounts", {
						url : "/accounts",
						templateUrl : 'pages/account/account.html'
					})

				} ]);

function addAlert(message, additionalData) {
	$('#alerts')
			.append(
					'<div id="dataLoadFailedAlert" class="alert alert-danger alert-dismissible" role="alert">'
							+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
							+ '<span aria-hidden="true">&times;</span>'
							+ '</button>'
							+ message
							+ "<br>"
							+ JSON.stringify(additionalData) + '</div>');
	$("#dataLoadFailedAlert").delay(5000).fadeOut(function() {
		$(this).remove();
	});

}