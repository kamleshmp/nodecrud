var scotchTodo = angular.module('scotchTodo', []);

function mainController($scope, $http) {
    $scope.selectedColumns = {};
    $scope.selectedTables = [];
    $scope.tablesToDownload = {};
    $scope.tablePreview = [];
    $scope.tablePreviewColumns = [];
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
        $scope.tableDetails = [];
        $scope.tableHeadings = [];
        console.log({ table: $scope.tableName })
        $http.post('/api/table_details', JSON.stringify({ table: $scope.tableName }))
            .success(function(res) {
                if (res.data.length) {
                    $scope.tableHeadings = Object.keys(res.data[0]);
                    $scope.tableDetails = res.data
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getTableColumns = function(table_name) {
        $http.post('/api/table_columns', JSON.stringify({ table: table_name }))
            .success(function(res) {
                if (res.data.length) {
                    $scope.columns = res.data;
                    $scope.selectedColumns[table_name] = res.data;
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



    setTimeout(function() {
        $('.dropdown-mul-2').dropdown({
            input: '<input type="text" maxLength="20" placeholder="Search">',
            choice: function(item, val) {
                if (val.selected) {
                    $scope.selectedTables.push(val.id);
                    $scope.selectedColumns[val.id] = [];
                    $scope.getTableColumns(val.id);
                    $scope.tablesToDownload[val.id] = [];
                } else {
                    var idx = $scope.selectedTables.indexOf(val.id);
                    if (idx > -1) {
                        $scope.selectedTables.splice(idx, 1);
                        delete $scope.selectedColumns[val.id];
                        $scope.getTableColumns('');
                        delete $scope.tablesToDownload[val.id]
                    }
                }

            }
        });
    }, 2000);
    $scope.models = {};
    $scope.addColumn = function(table, column) {
        var data = $scope.tablesToDownload[table] || [];
        if ($scope.models[table + column]) {
            data.push(table+'.'+column)
        } else {
            var idx = data.indexOf(table+'.'+column);
            if (idx > -1) {
                data.splice(idx, 1);
            }
        }
        $scope.tablesToDownload[table] = data;
        console.log($scope.tablesToDownload)
    }

    $scope.showDownload = function() {
        return Object.keys($scope.selectedColumns).length > 0 ? true : false;
    }

    $scope.showPreview = function() {
        var array_values = [];
        for (var key in $scope.tablesToDownload) {
            array_values.concat($scope.tablesToDownload[key]);
        }
        alert(array_values.length)
        if (Object.keys($scope.tablesToDownload).length) {
            console.log('data', $scope.tablesToDownload)
            $http.post('/api/download_tables', JSON.stringify({tables: $scope.tablesToDownload}))
            .success(function(res) {
                if (res.data.length) {
                    $scope.tablePreview = res.data;
                    $scope.tablePreviewColumns = Object.keys(res.data[0])
                }
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        } else {
            alert('No table selected');
        }
    }

}