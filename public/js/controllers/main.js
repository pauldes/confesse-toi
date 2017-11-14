angular.module('todoController', [])

	// inject the Sin service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all sins and show them
		// use the service to get all the sins
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a sin after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Todos.delete(id)
				// if successful creation, call our get function to get all the new sins
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of sins
				});
		};

        // UPVOTE ==================================================================
        // upvote a sin after clicking 'up'
        $scope.upvoteSin = function(id) {
            $scope.loading = false;

            Todos.upvote(id)
            // if successful creation, call our get function to get all the new sins
                .success(function(data) {
                    $scope.loading = false;
                    $scope.todos = data; // assign our new list of sins
                });
        };

        // DOWNVOTE ==================================================================
        // downvote a sin after clicking 'down'
        $scope.downvoteSin = function(id) {
            $scope.loading = false;

            Todos.downvote(id)
            // if successful creation, call our get function to get all the new sins
                .success(function(data) {
                    $scope.loading = false;
                    $scope.todos = data; // assign our new list of sins
                });
        };
/*
				$scope.isLoggedIn = function() {

					$http.get('/checklogin')
						.success(function(data) {
							console.log(data);
							$rootScope.loggedIn = data;
						})
						.error(function(data) {
							console.log('error: ' + data);
						});
				};*/

	}]);
