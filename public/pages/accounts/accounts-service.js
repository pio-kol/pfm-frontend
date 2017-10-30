app
		.factory(
				'accountsService',
				["$q", "$translate", 'googleService', '$http',
						function($q, $translate, googleService, $http) {
							var service = {};

					  service.createNewAccount = function(data) {
            				var newAccount = new Account();
            				newAccount.id = "" + data.id;
            				newAccount.name = data.name;
            				newAccount.value = data.value;

            				return newAccount;
            			}

            service.saveNewAccount = function(newAccount) {
            		  var defer = $q.defer();
            //		debugger;
            			var account = {
                      "name" : newAccount.name,
                      "value" : newAccount.value,
                  }

                  $http.post("http://localhost:8080/v1/accounts/", account)
                    .then(
                      function(response) {
            //            console.log(JSON.stringify(response));
                          $http.get("http://localhost:8080/v1/accounts/" + response.data)
                           .then(
                             function(response) {
                               var newAccount = service.createNewAccount(response.data);
                                  defer.resolve(newAccount);
                             },
                             function(response) {
                               $translate('ERROR_ACCOUNT_ADD', {name : newAccount.description})
                                .then(function (message) {
                                  addAlert(message, response);
                               });
                             defer.reject();
                             }
                           );
                      },
                      function(response) {
                              $translate('ERROR_ACCOUNT_ADD', {name : newAccount.description})
                                .then(function (message) {
                                  addAlert(message, response);
                                });
                              defer.reject();
                            });
                      return defer.promise;
            };
          }
				]
		);

