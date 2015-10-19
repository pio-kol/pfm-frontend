function cancelAddNewAccount() {
	$("#accountRow_new").remove();
}

function saveNewAccount() {
	var account = {
		"name" : $("#newAccountName").val(),
		"state" : $("#newAccountValue").val(),
	}

	$
			.ajax({
				url : "/_ah/api/accountendpoint/v1/account",
				contentType : "application/json",
				type : 'POST',
				data : JSON.stringify(account),
				success : function(data) {
					$("#accountRow_new").remove();
					$("#refreshButton").click();
				},
				error : function(data) {
					addAlert("Nie udało się dodać nowego konta - spróbuj ponownie póżniej.");
				}
			});

};

angular
		.module('myApp', [])
		.controller(
				'accountController',
				function($scope) {

					$scope.accounts = [];

					$(document).ready(function() {
						$(".alert").alert("close");
						$scope.refreshAccounts();
					});

					function addAlert(message) {
						$('#alerts')
								.append(
										'<div id="dataLoadFailedAlert" class="alert alert-danger alert-dismissible" role="alert">'
												+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
												+ '<span aria-hidden="true">&times;</span>'
												+ '</button>'
												+ message
												+ '</div>');
						$("#dataLoadFailedAlert").delay(3000).fadeOut(
								function() {
									$(this).remove();
								});

					}

					$scope.refreshAccounts = function() {

						$
								.ajax({
									url : "/_ah/api/accountendpoint/v1/account",
									dataType : 'json',
									success : function(data) {
										$scope.accounts = [];
										for (i = 0; i < data.items.length; ++i) {
											$scope.accounts.push({
												id : data.items[i].id.id,
												name : data.items[i].name,
												value : data.items[i].state
											});
										}

										$scope.accounts
												.sort(function(a, b) {
													return a.name
															.localeCompare(b.name);
												});
										$scope.$apply();
									},
									error : function(data) {
										addAlert("Nie udało się pobrać danych - spróbuj ponownie póżniej.");
									}
								});
					}

					$scope.addNewAccount = function(id) {
						$("#accountsTableBody tr:last-child").after(
								"<tr id='accountRow_new'/>");
						$("#accountRow_new").load("newAccount.html");
					}

					$scope.editAccount = function(id) {
						$("#accountRow_" + id + " > .editable").show();
						$("#accountRow_" + id + " > .readOnly").hide();
						$("#accountHeader > .editable").show();
						$("#accountHeader > .readOnly").hide();
					};

					$scope.cancelEditAccount = function(id) {
						$("#accountRow_" + id + " > .editable").hide();
						$("#accountRow_" + id + " > .readOnly").show();
						$("#accountHeader > .editable").hide();
						$("#accountHeader > .readOnly").show();
						$scope.refreshAccounts();
					};

					$scope.removeAccount = function(id, name) {
						bootbox
								.confirm(
										"Konto <b>'"
												+ name
												+ "'</b> zostanie usuniete. Kontynuowac?",
										function(result) {
											if (result) {
												$
														.ajax({
															url : "/_ah/api/accountendpoint/v1/account/"
																	+ id,
															type : 'DELETE',
															success : function(
																	data) {
																$(
																		"#accountRow_"
																				+ id)
																		.remove();

															},
															error : function(
																	data) {
																addAlert("Nie udało się usunąć konta <b>'"
																		+ name
																		+ "'</b> - spróbuj ponownie póżniej.");
															}
														});
											}
										});
					};

					$scope.saveAccount = function(id, name, value) {
						var account = {
							"id" : {
								"id" : id
							},
							"name" : name
						}

						$
								.ajax({
									url : "/_ah/api/accountendpoint/v1/account",
									contentType : "application/json",
									type : 'PUT',
									data : JSON.stringify(account),
									success : function(data) {
										$("#accountRow_" + id + " > .editable")
												.hide();
										$("#accountRow_" + id + " > .readOnly")
												.show();
										$("#accountHeader > .editable").hide();
										$("#accountHeader > .readOnly").show();
									},
									error : function(data) {
										addAlert("Nie udało się zmodyfikować konta <b>'"
												+ name
												+ "'</b> - spróbuj ponownie póżniej.");
									}
								});

					};

				});