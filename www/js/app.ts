angular.module('crawler', [])
.controller('HomeController', ['$scope', function($scope) {
	$scope.cars = [
		{
			make: 'BMW',
			model: '325is',
			year: 1995,
			color: 'red',
			dateAdded: '3 days',
			location: 'Mount Airy',
			locationId: 208,
			section: 'AZ'
		}
	];
}]);