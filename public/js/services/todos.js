angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			},
			/*
            upvote : function(id) {
                return $http.upvote('/api/todos/' + id);
            },
            downvote : function(id) {
                return $http.downvote('/api/todos/' + id);
            }
            */
		}
	}]);