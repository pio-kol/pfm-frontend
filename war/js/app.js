var app = angular.module('myApp',
		[ 'angular.chosen', 'pascalprecht.translate', 'ngSanitize' ]);

app.config([ '$translateProvider', function($translateProvider) {
	var translations_pl = {
		MAIN_CATEGORY : 'Kategoria główna',
		SAVE : 'Zapisz',
		CANCEL : 'Anuluj',
		DELETE : 'Usuń',
		EDIT : 'Edytuj',
		NAME : 'Nazwa',
		PARENT_CATEGORY : 'Kategoria nadrzędna',
		REFRESH : 'Odśwież',
		NEW_CATEGORY : 'Nowa kategoria'
	};

	var translations_en = {
		MAIN_CATEGORY : 'Main category',
		SAVE : 'Save',
		CANCEL : 'Cancel',
		DELETE : 'Delete',
		EDIT : 'Edit',
		NAME : 'Category name',
		PARENT_CATEGORY : 'Parent category',
		REFRESH : 'Refresh',
		NEW_CATEGORY : 'New category'
	};

	$translateProvider //
	.useSanitizeValueStrategy('escape') //
	.translations('pl', translations_pl) //
	.translations('en', translations_en) //
	.preferredLanguage('en');
} ]);