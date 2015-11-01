var app = angular.module('myApp', [ 'angular.chosen', 'pascalprecht.translate',
		'ngSanitize', 'ui.router' ]);

var alertNumber = 0;
function addAlert(message, additionalData) {
	++alertNumber;
	$('#alerts')
			.append(
					'<div id="dataLoadFailedAlert_' + alertNumber + '" class="alert alert-danger alert-dismissible" role="alert">'
							+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
							+ '<span aria-hidden="true">&times;</span>'
							+ '</button>'
							+ message
							+ "<br>"
							+ JSON.stringify(additionalData) + '</div>');
	$("#dataLoadFailedAlert_" + alertNumber).delay(5000).fadeOut(function() {
		$(this).remove();
	});

}