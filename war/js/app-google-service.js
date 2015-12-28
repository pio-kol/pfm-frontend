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
									'immediate' : true
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
										gapi.auth.authorize({
											'client_id' : CLIENT_ID,
											'scope' : SCOPES.join(' '),
											'immediate' : false
										}, function(authResult){
											if (authResult && !authResult.error) {
												defer.reject();
											} else {
												defer.resolve();
											}
										});
										//defer.reject();
									}
								});
								
								return defer.promise;
							}

							function callScriptFunctionInternal(functionName, parameters) {
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
								var defer = $q.defer();
								
								if (SPREADSHEET_ID != null){
									defer.resolve();
								} else {
									callScriptFunctionInternal("prepareFolderAndSpreadsheet")
									.then(
											function(response) {
												SPREADSHEET_ID = response.response.result;
												defer.resolve();
											},
											function(response) {
												defer.reject(JSON.stringify(response));
											});
								}
								
								return defer.promise;
							}
							
							service.callScriptFunction = function(functionName, object) {
								var defer = $q.defer();
								
								getSpreadsheetId().then(function(response){
									callScriptFunctionInternal(functionName, [SPREADSHEET_ID, object])
									.then(function(response){
										defer.resolve(response.response.result);
									}, 
											function(response){
										defer.reject(response);
									});
								});
								
								return defer.promise;
							}
							
							return service;

						} ]);