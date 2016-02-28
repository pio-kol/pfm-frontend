app
		.controller('navigationBarController', function($scope) {

			$scope.affixed = 'top';
			$scope.search = {
				show : false,
				terms : ''
			};
			$scope.inverse = true;

			$scope.menus = [ {
				title : "MENU_TRANSACTION_HISTORY",
				action : "transactions"
			}, {
				title : "MENU_CATEGORIES",
				action : "categories"
			}, {
				title : "MENU_ACCOUNTS",
				action : "accounts"
			}, {
				title : "MENU_LOG",
				action : "log"
			}

			]; // end menus

			$scope.styling = 'Inverse';
			$scope.searchDisplay = 'Visible';

		})

		/**
		 * Angled Navbar Directive
		 * 
		 * @requires: ngSanitize, Bootstrap 3 (jQuery & Bootstrap's JS -
		 *            responsive features require the inclusion of the Bootstrap
		 *            JS)
		 */
		.directive(
				'angledNavbar',
				function(googleService, $state) {
					return {
						restrict : 'AE',
						scope : {
							menus : '=',
							affixed : '=',
							search : '=',
							searchfn : '&',
							navfn : '&',
							inverse : '='
						},
						templateUrl : 'pages/navigation/navigationBar.html',
						controller : function($scope, $element, $attrs,
								$translate) {

							$scope.loggedIn = true;

							$scope.toggleLanguage = function() {
								$translate.use($translate.use() === "en" ? "pl"
										: "en");
							};

							$scope.userName = "";
							$scope.userImageUrl = "";
							
							$scope.getUserInfo = function() {
								googleService.getUserInfo()
								.then(
										function(response) {
											$scope.userName = response.name;
											$scope.userImageUrl = response.picture;
										});
							}

							$scope.handleAuthClick = function() {
								googleService.checkAuth().then(
										function(response) {
											$scope.loggedIn = true;
											$scope.getUserInfo();
											$state.transitionTo('logged-in',
													{}, {
														notify : true
													});
										}, function(response) {
											$scope.loggedIn = false;
											alert("Failed to login");
										});
							}
							
							$scope.signOut = function() {
//								googleService.signOut()
//								.then(
//										function(response) {
//											alert(JSON.stringify(response));
//										},
//										function(response) {
//											alert(JSON.stringify(response));
//										});
								$scope.loggedIn = false;
								$scope.userName = "";
								$scope.userImageUrl = "";
								
							}

							$scope.isUserLoggedIn = function() {
								return $scope.loggedIn;
							}


							$scope.titleClicked = function() {
								googleService.checkAuth().then(
										function(response) {
											$state.transitionTo('logged-in',
													{}, {
														notify : true
													});
										}, function(response) {
											$state.transitionTo('login', {}, {
												notify : true
											});
										});
							}

							$scope.defaults = {
								menus : [],
								search : {
									show : false
								}
							}; // end defaults

							// if no parent function was passed to directive for
							// navfn, then create one to emit an event
							if (angular.isUndefined($attrs.navfn)) {
								$scope.navfn = function(action) {
									if (angular.isObject(action))
										$scope.$emit('nav.menu', action);
									else
										$scope.$emit('nav.menu', {
											'action' : action
										});
								}; // end navfn
							}

							// if no parent function was passed to directive for
							// searchfn, then create one to emit a search event
							if (angular.isUndefined($attrs.searchfn)) {
								$scope.searchfn = function() {
									$scope.$emit('nav.search.execute');
								}; // end searchfn
							}

							// === Observers & Listeners ===//

							$scope
									.$watch(
											'affixed',
											function(val, old) {
												var b = angular.element('body');
												// affixed top
												if (angular.equals(val, 'top')
														&& !b
																.hasClass('navbar-affixed-top')) {
													if (b
															.hasClass('navbar-affixed-bottom'))
														b
																.removeClass('navbar-affixed-bottom');
													b
															.addClass('navbar-affixed-top');
													// affixed bottom
												} else if (angular.equals(val,
														'bottom')
														&& !b
																.hasClass('navbar-affixed-bottom')) {
													if (b
															.hasClass('navbar-affixed-top'))
														b
																.removeClass('navbar-affixed-top');
													b
															.addClass('navbar-affixed-bottom');
													// not affixed
												} else {
													if (b
															.hasClass('navbar-affixed-top'))
														b
																.removeClass('navbar-affixed-top');
													if (b
															.hasClass('navbar-affixed-bottom'))
														b
																.removeClass('navbar-affixed-bottom');
												}
											}); // end watch(affixed)

							// === Methods ===//

							$scope.noop = function() {
								angular.noop();
							}; // end noop

							$scope.navAction = function(action) {
								$scope.navfn({
									'action' : action
								});
							}; // end navAction

							/**
							 * Has Menus Checks to see if there were menus
							 * passed in for the navbar.
							 * 
							 * @result boolean
							 */
							$scope.hasMenus = function() {
								return (angular.isDefined($attrs.menus));
							};

							/**
							 * Has Dropdown Menu Check to see if navbar item
							 * should have a dropdown menu
							 * 
							 * @param object
							 *            menu
							 * @result boolean
							 */
							$scope.hasDropdownMenu = function(menu) {
								return (angular.isDefined(menu.menu) && angular
										.isArray(menu.menu));
							}; // end hasDropdownMenu

							/**
							 * Is Divider Check to see if dropdown menu item is
							 * to be a menu divider.
							 * 
							 * @param object
							 *            item
							 * @result boolean
							 */
							$scope.isDivider = function(item) {
								return (angular.isDefined(item.divider) && angular
										.equals(item.divider, true));
							}; // end isDivider
						}
					};
				});
// end navbar

