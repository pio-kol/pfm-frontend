app
    .factory(
        'filtersService',
        [
            "$q", "$translate", '$http',
            function ($q, $translate, $http) {
                var service = {};

                function findCategoryBasedOnId(categories, id) {
                    for (var i = 0; i < categories.length; ++i) {
                        if (id == categories[i].id) {
                            return categories[i];
                        }
                    }

                    return null;
                }

                function findAccountBasedOnId(accounts, id) {
                    for (var i = 0; i < accounts.length; ++i) {
                        if (id == accounts[i].id) {
                            return accounts[i];
                        }
                    }

                    return null;
                }

                function createNewFilter(item, accounts, categories) {
                    var filter = new TransactionsFilter();
                    filter.id = "" + item.id;
                    filter.name = item.name;
                    if (item.categories != null) {
                        for (var i = 0; i < item.categories.length; ++i) {
                            var category = findCategoryBasedOnId(item.categories[i].id, categories);
                            if (category != null) {
                                filter.categories.push(category);
                            }
                        }
                    }
                    if (item.accounts != null) {
                        for (var i = 0; i < item.accounts.length; ++i) {
                            var account = findAccountBasedOnId(item.accounts[i].id, accounts);
                            if (account != null) {
                                filter.accounts.push(account);
                            }
                        }
                    }
                    filter.dateRange.startDate = moment(new Date(item.dateFrom));
                    filter.dateRange.endDate = moment(new Date(item.dateTo));
                    filter.description = item.description;
                    filter.priceFrom = parseFloat(item.priceFrom);
                    if (isNaN(filter.priceFrom)) {
                        filter.priceFrom = null;
                    }
                    filter.priceTo = parseFloat(item.priceTo);
                    if (isNaN(filter.priceTo)) {
                        filter.priceTo = null;
                    }
                    filter.comment = item.comment;

                    return filter;
                }

                service.addNewFilter = function (newFilter, accounts, categories) {

                    var filter = {
                        "name": "( New filter )",
                        "categories": [],
                        "accounts": [],
                        "dateFrom": newFilter.dateRange.startDate,
                        "dateTo": newFilter.dateRange.endDate,
                        "priceFrom": newFilter.priceFrom,
                        "priceTo": newFilter.priceTo,
                        "description": newFilter.description,
                        "comment": newFilter.comment
                    }

                    for (var i = 0; i < editedFilter.accounts.length; ++i) {
                        account = {}
                        account.id = editedFilter.accounts[i].id
                        filter.accounts.push(account);
                    }

                    for (var i = 0; i < editedFilter.categories.length; ++i) {
                        category = {}
                        category.id = editedFilter.categories[i].id
                        filter.categories.push(category);
                    }

                    var defer = $q.defer();

                    $http.post("http://localhost:8080/v1/filters/", filter)
                        .then(
                            function (response) {

                                $http.get("http://localhost:8080/v1/filters/" + response.data)
                                    .then(
                                        function (response) {

                                            newFilter = createNewFilter(response.data, accounts, categories)
                                            defer.resolve(newFilter);

                                        }, function (response) { // FIXME message
                                            $translate('ERROR_TRANSACTION_ADD', {
                                                name: newFilter.description
                                            }).then(function (message) { // FIXME
                                                // message
                                                addAlert(message, response);
                                                defer.reject();
                                            });
                                        });

                            }, function (response) { // FIXME message
                                $translate('ERROR_TRANSACTION_ADD', {
                                    name: newFilter.description
                                }).then(function (message) { // FIXME
                                    // message
                                    addAlert(message, response);
                                    defer.reject();
                                });
                            });

                    return defer.promise;
                };

                service.refreshFilters = function (accounts, categories) {
                    var defer = $q.defer();

                    var filters = [];

                    data = {}
                    data.id = 1;
                    data.name = "basic"
                    data.dateFrom = "2010-01-01"
                    data.dateTo = "2020-01-01"

                    var newFilter = createNewFilter(data, accounts, categories);
                    filters.push(newFilter);

                    // defer.resolve(filters);

                    $http.get("http://localhost:8080/v1/filters/")
                        .then(function (data) {
                            var filters = [];

                            if (data != null && data.data != null) {
                                for (var i = 0; i < data.data.length; ++i) {
                                    var newFilter = createNewFilter(data.data[i], accounts, categories);
                                    filters.push(newFilter);
                                }
                            }

                            defer.resolve(filters);
                        }, function (response) {
                            $translate('ERROR_DATA_RETRIVE').then(function (message) {
                                addAlert(message, response);
                            });
                            defer.reject();
                        });

                    return defer.promise;
                }

                service.saveEditedFilter = function (editedFilter, accounts, categories) {
                    var filter = {
                        "id": editedFilter.id,
                        "name": editedFilter.name,
                        "categories": [],
                        "accounts": [],
                        "dateFrom": editedFilter.dateRange.startDate,
                        "dateTo": editedFilter.dateRange.endDate,
                        "priceFrom": editedFilter.priceFrom,
                        "priceTo": editedFilter.priceTo,
                        "description": editedFilter.description,
                        "comment": editedFilter.comment
                    }

                    for (var i = 0; i < editedFilter.accounts.length; ++i) {
                        account = {}
                        account.id = editedFilter.accounts[i].id
                        filter.accounts.push(account);
                    }

                    for (var i = 0; i < editedFilter.categories.length; ++i) {
                        category = {}
                        category.id = editedFilter.categories[i].id
                        filter.categories.push(category);
                    }

                    var defer = $q.defer();
                    $http.put("http://localhost:8080/v1/filters/" + filter.id, filter)
                        .then(
                            function (response) {
                                editedFilter = createNewFilter(response.data, accounts, categories)
                                defer.resolve(editedFilter);
                            },
                            function (response) { // FIXME message
                                $translate('ERROR_TRANSACTION_ADD', {name: filter.name}).then(function (message) {
                                    addAlert(message, response);
                                });
                                defer.reject();
                            });

                    return defer.promise;

                };

                service.deleteFilter = function (filterToDelete) {
                    var defer = $q.defer();

                    $http.delete("http://localhost:8080/v1/filters/" + filterToDelete.id)
                        .then(
                            function (response) {
                                defer.resolve();
                            },
                            function (response) {
                                $translate('ERROR_TRANSACTION_REMOVE', {name: filterToDelete.name}).then(function (message) {
                                    addAlert(message, response);
                                });
                                defer.reject();
                            });

                    return defer.promise;
                };

                return service;

            }]);