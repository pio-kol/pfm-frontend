function cancelAddNewCategory() {
	$("#categoryRow_new").remove();
}

function saveNewCategory() {
	var category = {
		"name" : $("#newCategoryName").val(),
		"state" : $("#newCategoryParentId").val(),
	}

	$
			.ajax({
				url : "/_ah/api/categoryendpoint/v1/category",
				contentType : "application/json",
				type : 'POST',
				data : JSON.stringify(category),
				success : function(data) {
					$("#categoryRow_new").remove();
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
				'categoryController',
				function($scope) {

					$scope.categories = [];

					$(document).ready(function() {
						$(".alert").alert("close");
						$scope.refreshCategories();
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

					$scope.refreshCategories = function() {

						$
								.ajax({
									url : "/_ah/api/categoryendpoint/v1/category",
									dataType : 'json',
									success : function(data) {
										$scope.categories = [];
										for (i = 0; i < data.items.length; ++i) {
											$scope.categories.push({
												id : data.items[i].id.id,
												name : data.items[i].name,
											// parentName : data.items[i].
											});
										}

										$scope.categories
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

					$scope.editCategory = function(id) {
						$("#categoryRow_" + id + " > .editable").show();
						$("#categoryRow_" + id + " > .readOnly").hide();
						$("#categoryHeader > .editable").show();
						$("#categoryHeader > .readOnly").hide();
					};

					$scope.cancelEditCategory = function(id) {
						$("#categoryRow_" + id + " > .editable").hide();
						$("#categoryRow_" + id + " > .readOnly").show();
						$("#categoryHeader > .editable").hide();
						$("#categoryHeader > .readOnly").show();
						$scope.refreshCategories();
					};

					$scope.removeCategory = function(id, name) {
						bootbox
								.confirm(
										"Konto <b>'"
												+ name
												+ "'</b> zostanie usuniete. Kontynuowac?",
										function(result) {
											if (result) {
												$
														.ajax({
															url : "/_ah/api/categoryendpoint/v1/category/"
																	+ id,
															type : 'DELETE',
															success : function(
																	data) {
																$(
																		"#categoryRow_"
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

					$scope.saveCategory = function(id, name, value) {
						var category = {
							"id" : {
								"id" : id
							},
							"name" : name,
							"state" : value
						}

						$
								.ajax({
									url : "/_ah/api/categoryendpoint/v1/category",
									contentType : "application/json",
									type : 'PUT',
									data : JSON.stringify(category),
									success : function(data) {
										$("#categoryRow_" + id + " > .editable")
												.hide();
										$("#categoryRow_" + id + " > .readOnly")
												.show();
										$("#categoryHeader > .editable").hide();
										$("#categoryHeader > .readOnly").show();
									},
									error : function(data) {
										addAlert("Nie udało się zmodyfikować konta <b>'"
												+ name
												+ "'</b> - spróbuj ponownie póżniej.");
									}
								});

					};

					$scope.addNewCategory = function(id) {
						$("#categoriesTableBody tr:last-child").after(
								"<tr id='categoryRow_new'/>");
						$("#categoryRow_new").load("category_new.html");
					}

				});