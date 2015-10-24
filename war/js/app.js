var app = angular.module('myApp', [ 'angular.chosen', 'pascalprecht.translate',
		'ngSanitize', 'ui.router' ]);

app.config([ '$translateProvider', '$stateProvider', '$urlRouterProvider',
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
				MENU_CATEGORIES : "Zarządzanie kategoriami"
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
				MENU_CATEGORIES : "Categories"
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

function addAlert(message) {
	$('#alerts')
			.append(
					'<div id="dataLoadFailedAlert" class="alert alert-danger alert-dismissible" role="alert">'
							+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
							+ '<span aria-hidden="true">&times;</span>'
							+ '</button>' + message + '</div>');
	$("#dataLoadFailedAlert").delay(3000).fadeOut(function() {
		$(this).remove();
	});

}