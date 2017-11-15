angular.module('curUserService', [])

	.factory('CurUser', ['$http',function($http) {
		return {
			get : function() {
        return $http.get('/api/curuser');

			}

		}
	}]);
