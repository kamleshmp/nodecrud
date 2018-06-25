var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/all_tables')
        .success(function(res) {
            $scope.tables = res.data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.getTableInfo = function(table_name) {
        $scope.tableHeadings = [];
        console.log({table: $scope.tableName})
        $http.post('/api/table_details', JSON.stringify({table: $scope.tableName}))
            .success(function(res) {
                if(res.data.length) {
                    $scope.tableHeadings = Object.keys(res.data[0]);
                    $scope.tableDetails = res.data
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
