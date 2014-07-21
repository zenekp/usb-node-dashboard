'use strict';

angular.module('USBDashboard', [
	'ngRoute',
	'USBDashboard.filters',
	'USBDashboard.services',
	'USBDashboard.directives',
	'USBDashboard.controllers',
	'angularLocalStorage'
]).
config(function($routeProvider,$httpProvider,$locationProvider) {
	$httpProvider.responseInterceptors.push('httpInterceptor');
	$locationProvider.html5Mode(true);
	
	var configResolve = { 
		config: function($q, $http, $routeParams, storage) {
			var _this = this;
			var defer = $q.defer();
			var modelName = $routeParams.model;
			if (!storage.get(modelName+'-config')) {
				$http.get('data/'+modelName+'.json')
					.success(function(data) {
						defer.resolve(data);
						storage.set(modelName+'-config', data);
					})
					.error(function() {
						defer.reject('could not find data/'+modelName+'.json');
					});
			} else {
				defer.resolve(storage.get(modelName+'-config'));
			}
			
			return defer.promise;
		}
	};
	
	// $routeProvider.when('/', {templateUrl: 'partials/report.html', controller: 'ReportCtrl'});
	$routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
	$routeProvider.when('/:model', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
	$routeProvider.when('/:model/create', {templateUrl: 'partials/create.html', controller: 'CreateCtrl', resolve: configResolve});
	$routeProvider.when('/:model/update/:id', {templateUrl: 'partials/update.html', controller: 'UpdateCtrl', resolve: configResolve });
	$routeProvider.when('/:model/:action/:id', {templateUrl: 'partials/update.html', controller: 'ReadDeleteCtrl'}); // read, update, delete
	$routeProvider.otherwise({redirectTo: '/'});
}).
factory('httpInterceptor', function httpInterceptor($q, $window, $location) {
	return function (promise) {
		var success = function (response) {
			return response;
		};
		var error = function (response) {
			if (response.status === 401) {
				$location.url('/login');
			}
			return $q.reject(response);
		};
		return promise.then(success, error);
	};
}).
constant('API', {
	serviceURL: 'http://localhost:8080',
	tokenEndPoint: '/token'
}).
constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});