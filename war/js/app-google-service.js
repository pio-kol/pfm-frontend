app
		.factory(
				'googleService',
				[
						"$q", "$translate",
						function($q, $translate) {
							var service = {};
							
							var SPREADSHEET_ID = null;

							var CLIENT_ID = '1038988444391-bvd0to4hgd0mkfg9hunpqkcj3089hovq.apps.googleusercontent.com';
							var SCRIPT_ID = "MbIEcQFOqy8BdvgfVV-hhRqHVcGstMHy0";

							var SCOPES = [ 'https://www.googleapis.com/auth/spreadsheets',
									'https://www.googleapis.com/auth/drive',
									'https://www.googleapis.com/auth/userinfo.profile' ];
							
							service.checkAuth = function() {
								var defer = $q.defer();
								
								gapi.auth.authorize({
									'client_id' : CLIENT_ID,
									'scope' : SCOPES.join(' '),
									'immediate' : false
								}, function(authResult) {
									
									if (authResult && !authResult.error) {

//										// Make the API request.
//										var op = gapi.client.request({
//											'root' : 'https://www.googleapis.com',
//											'path' : 'oauth2/v1/userinfo',
//											'method' : 'GET',
//										// 'body': request
//										});
								//
//										op.execute(function(resp) {
//											if (resp.error) {
//												appendPre(JSON.stringify(resp));
//											} else {
//												appendPre(JSON.stringify(resp));
//											}
//										});
								//
										defer.resolve();

									} else {
//										gapi.auth.authorize({
//											'client_id' : CLIENT_ID,
//											'scope' : SCOPES.join(' '),
//											'immediate' : false
//										}, handleAuthResult);
										defer.reject();
									}
								});
								
								return defer.promise;
							}

							callScriptFunctionInternal = function(functionName, parameters) {
								var request = {
									'function' : functionName,
									'parameters' : parameters,
									'devMode' : true
								};

								// Make the API request.
								var op = gapi.client.request({
									'root' : 'https://script.googleapis.com',
									'path' : 'v1/scripts/' + SCRIPT_ID + ':run',
									'method' : 'POST',
									'body' : request
								});
								
								var defer = $q.defer();

								op.execute(function(resp) {
									if (resp.error) {
										defer.reject(resp);
									} else {
										defer.resolve(resp);
									}
								});
								
								return defer.promise;
							}

							
							function getSpreadsheetId(){
								if (SPREADSHEET_ID != null){
									return SPREADSHEET_ID;
								}
								
								callSpreadsheetFunctionInternal("prepareFolderAndSpreadsheet")
								.then(
										function(response) {
											alert(JSON.stringify(reponse));
											return SPREADSHEET_ID = response;
										},
										function(response) {
											$translate('ERROR_TRANSACTION_ADD', {name : newTransaction.description}).then(function (message) {
											    addAlert(message, response);
											  });
											throw new Exception(JSON.stringify(reponse));
										});
							}
							
							service.callScriptFunction = function(functionName, object) {
								var spreadsheetId = getSpreadsheetId();
								
								return callSpreadsheetFunctionInternal(functionName, [spreadsheetId, object]);
							}
							
							return service;

						} ]);