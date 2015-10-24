//angular.module('navigationBar',['ngSanitize'])

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
				action : "historyOfTransactions"
			}, {
				title : "MENU_CATEGORIES",
				action : "categories"
			}, {
				title : "MENU_ACCOUNTS",
				action : "accounts"
			} ]; // end menus

			$scope.item = 'history.html';
			$scope.styling = 'Inverse';
			$scope.searchDisplay = 'Visible';

			$scope.toggleLanguage = function() {
				alert('Toggle language');
			};

			$scope.searchfn = function() {
				alert('Attempting search on: "' + $scope.search.terms + '"');
			}; // searchfn

			$scope.navfn = function(action) {
				switch (action) {
				case 'historyOfTransactions':
					$scope.item = 'history.html';
					break;
				case 'categories':
					$scope.item = 'category.html';
					break;
				case 'accounts':
					$scope.item = 'account.html';
					break;
				default:
					$scope.item = 'history.html';
					break;
				}
				; // end switch
			}; // end navfn
		})
		// end navbarDirectiveTestCtrl

		/**
		 * Angled Navbar Directive
		 * 
		 * @requires: ngSanitize, Bootstrap 3 (jQuery & Bootstrap's JS -
		 *            responsive features require the inclusion of the Bootstrap
		 *            JS)
		 */
		.directive(
				'angledNavbar',
				function() {
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
						templateUrl : 'tmpls/nav/navbar.html',
						controller : function($scope, $element, $attrs,
								$translate) {
							// === Scope/Attributes Defaults ===//

							$scope.toggleLanguage = function() {
								$translate.use($translate.use() === "en" ? "pl"
										: "en");
							};

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
				})
		// end navbar

		.run(
				function($templateCache) {
					$templateCache
							.put(
									'tmpls/nav/navbar.html',
									'<nav class="navbar" ng-class="{\'navbar-inverse\': inverse,\'navbar-default\': !inverse,\'navbar-fixed-top\': affixed == \'top\',\'navbar-fixed-bottom\': affixed == \'bottom\'}" role="navigation"><div class="container-fluid"><div class="navbar-header"><button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu"><span class="sr-only">Toggle Navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" ng-click="noop()"><span class="glyphicon glyphicon-list-alt"></span> {{"PAGE_TITLE" | translate}}</a></div><div class="collapse navbar-collapse" id="navbar-menu"><ul class="nav navbar-nav" ng-if="hasMenus()"><li ng-repeat="menu in menus" ng-class="{true: \'dropdown\'}[hasDropdownMenu(menu)]"><a ng-if="!hasDropdownMenu(menu)" ng-click="navAction(menu.action)">{{menu.title | translate}}</a><a ng-if="hasDropdownMenu(menu)" class="dropdown-toggle" data-toggle="dropdown">{{menu.title}} <b class="caret"></b></a><ul ng-if="hasDropdownMenu(menu)" class="dropdown-menu"><li ng-repeat="item in menu.menu" ng-class="{true: \'divider\'}[isDivider(item)]"><a ng-if="!isDivider(item)" ng-click="navAction(item.action)">{{item.title}}</a></li></ul></li></ul><form ng-if="search.show" class="navbar-form navbar-right" role="search"><div class="form-group"><input type="text" class="form-control" placeholder="Search" ng-model="search.terms"><button class="btn btn-default" type="button" ng-click="searchfn()"><span class="glyphicon glyphicon-search"></span></button></div></form><ul class="nav navbar-nav navbar-right"><li><a href="#"><span class="glyphicon glyphicon-user"></span> {{"SIGN_UP"|translate}}</a></li><li><a href="#"><span class="glyphicon glyphicon-log-in"></span> {{"LOGIN"|translate}}</a></li><li><a ng-click="toggleLanguage()"><span class="glyphicon glyphicon-flag"></span> {{"LANGUAGE"|translate}}</a></li></ul></div></div></nav>');
				});