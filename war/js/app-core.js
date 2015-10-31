var app = angular.module('myApp', [ 'angular.chosen', 'pascalprecht.translate',
		'ngSanitize', 'ui.router' ]);

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