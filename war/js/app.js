var app = angular.module('myApp', [ 'angular.chosen', 'pascalprecht.translate',
		'ngSanitize' ]);

app.config([ '$translateProvider', function($translateProvider) {
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
		SIGN_UP : 'Utwórz konto'
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
		SIGN_UP : 'Sign up'
	};

	$translateProvider //
	.useSanitizeValueStrategy('escape') //
	.translations('pl', translations_pl) //
	.translations('en', translations_en) //
	.preferredLanguage('en');
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