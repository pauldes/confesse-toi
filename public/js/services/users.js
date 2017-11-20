angular.module('userService', [])

	.factory('Users', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/curruser');
			},
		}
	}]);
