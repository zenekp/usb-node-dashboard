'use strict';

var USBDashboardControllers = angular.module('USBDashboard.controllers', []);

USBDashboardControllers.controller('ApplicationController', function($http, $scope, AuthFactory) {	
	$scope.isAuthorized = AuthFactory.isAuthorized;
	$scope.logout = AuthFactory.logout;
});

USBDashboardControllers.controller('ListCtrl', ['$scope', '$routeParams', '$location', 'ListFactory', 'ReadUpdateDeleteFactory', 'API', 'storage',
	function($scope, $routeParams, $location, ListFactory, ReadUpdateDeleteFactory, API, storage) {
		$scope.modelName = $routeParams.model;
		$scope.orderProp = 'name';
		$scope.items = ListFactory($routeParams.model, API, storage.get('token')).list();
		$scope.delete = function (id) {
			ReadUpdateDeleteFactory($routeParams.model, id, API, storage.get('token')).delete()
			.$promise.then(
				function(value) { // success
					$scope.items.splice(id, 1); // TODO fix this id bisness
				},
				function(error) { // failure
					console.log(error);
				}
			);            
		};
}]);

USBDashboardControllers.controller('CreateCtrl', ['$scope', '$routeParams', '$location', 'CreateFactory', 'API', 'storage', 'config',
	function($scope, $routeParams, $location, CreateFactory, API, storage, config) {
		$scope.modelName = $routeParams.model;
		$scope.config = config;
		$scope.item = {};
		$scope.create = function (item) {
			CreateFactory($routeParams.model, API, storage.get('token')).create(item)
			.$promise.then(
				function(value) { // success
					$location.url($routeParams.model);
				},
				function(error) { // failure
					console.log(error);
				}
			);            
		};
}]);

USBDashboardControllers.controller('UpdateCtrl', ['$scope', '$routeParams', '$location', 'ReadUpdateDeleteFactory', 'API', 'storage', 'config',
	function($scope, $routeParams, $location, ReadUpdateDeleteFactory, API, storage, config) {
		$scope.modelName = $routeParams.model;
		$scope.config = config;
		$scope.item = {};
		ReadUpdateDeleteFactory($routeParams.model, $routeParams.id, API, storage.get('token')).read()
		.$promise.then(
			function(value) { //success
				$scope.item = value;
			},
			function(error) { // failure
				console.log(error);
			}
		);

		$scope.update = function (item) {
			ReadUpdateDeleteFactory($routeParams.model, $routeParams.id, API, storage.get('token')).update(item)
			.$promise.then(
				function(value) { // success
					$location.url($routeParams.model);
				},
				function(error) { // failure
					console.log(error);
				}
			);            
		};		
}]);

USBDashboardControllers.controller('ReadDeleteCtrl', ['$scope', '$routeParams', '$location', 'ReadUpdateDeleteFactory', 'API', 'storage',
	function($scope, $routeParams, $location, ReadUpdateDeleteFactory, API, storage) {
		$scope.modelName = $routeParams.model;
		// ReadUpdateDeleteFactory($routeParams.model, $routeParams.id, API, storage.get('token')).read()
		// .$promise.then(
		// 	function(value) { //success
		// 		$scope.item = value;
		// 	},
		// 	function(error) { // failure
		// 		console.log(error);
		// 	}
		// );
		

}]);

USBDashboardControllers.controller('ReportCtrl', ['$scope', '$routeParams', 'TemperatureFactory', 'API', 'storage', 'Pusher',
	function($scope, $routeParams, TemperatureFactory, API, storage, Pusher) {
		$scope.sensor = '533d7d699a31316640110f52';//$routeParams.sensor;
		$scope.temperature = 0;
		TemperatureFactory($scope.sensor, API, storage.get('token')).find()
		.$promise.then(
			function(value) { // success
				console.log(value);
				$scope.temperature = value[value.length - 1].temperature;
			},
			function(error) { // failure
				console.log(error);
			}
		);
		Pusher.subscribe('test_channel', 'temperature_update', function (value) {
			if (typeof value === 'object' && value[value.length - 1] && value[value.length - 1].temperature != undefined) {
				$scope.temperature = value[value.length - 1].temperature;
			}
		});
}]);

USBDashboardControllers.controller('LoginCtrl', function($scope, $rootScope, AUTH_EVENTS, AuthFactory) {
	$scope.login = function(credentials) {
		AuthFactory.login(credentials).then(function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			$scope.credentials = {};
		}, function() {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	};
});