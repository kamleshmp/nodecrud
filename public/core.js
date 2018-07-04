var app = angular.module('app', []);

function mainController($scope, $http) {
    $scope.selectedColumns = {};
    $scope.selectedTables = [];
    $scope.tablesToDownload = {};
    $scope.tablePreview = [];
    $scope.tablePreviewColumns = [];
    $scope.limit = 10;

    $scope.datepickerOptions = {
        format: 'yyyy-mm-dd',
        timezone:'UTC',
        language: 'en',
        autoclose: true,
        weekStart: 0
    }

   
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
        
        $http.post('/api/table_details', JSON.stringify({ table: $scope.tableName }))
            .success(function(res) {
                if (res.data.length) {
                    $scope.tableHeadings = Object.keys(res.data[0]);
                    $scope.tableDetails = res.data
                } else {
                    $scope.tableDetails = [];
                    $scope.tableHeadings = [];
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

    $scope.checkAll = function(table){
        console.log($scope.models[table + 'all'])
        if($scope.models[table+'all']) {
            for( var i =0; i < $scope.selectedColumns[table].length ; i++) {
                var column = $scope.selectedColumns[table][i].column_name;
                $scope.models[table+column] = true;
                $scope.addColumn(table, column)
            }
        } else {
            for( var i =0; i < $scope.selectedColumns[table].length ; i++) {
                var columnName = $scope.selectedColumns[table][i].column_name;
                $scope.models[table+columnName] = false;
                $scope.tablesToDownload[table] = []
            }
        }
    }



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
    }

    $scope.showDownload = function() {
        return Object.keys($scope.selectedColumns).length > 0 ? true : false;
    }

    $scope.checkFromDate = function(){
        console.log($scope.fromDate)
    }

    $( function() {
        $( "#datepicker1, #datepicker2" ).datepicker({
            dateFormat: 'yy-mm-dd'
        });
        $( "#datepicker1" ).change(function() {
            $scope.fromDate = $(this).val();
        })
        $( "#datepicker2" ).change(function() {
            $scope.toDate = $(this).val();
        })
      });
    
    $scope.resetData = function(){
        $scope.toDate = '';
        $scope.fromDate = '';
        $scope.sliderId = '';
        $( "#datepicker1, #datepicker2").val('');
    }

    $scope.showPreview = function(queryType) {
        $scope.showData = false;
        var array_values = [];
        for (var key in $scope.tablesToDownload) {
            array_values = array_values.concat($scope.tablesToDownload[key]);
        }
        
        if(array_values.length == 0) {
            alert('Please select fields');
            $scope.tablePreview = [];
            $scope.tablePreviewColumns = [];
            return;
        }
        
        if (Object.keys($scope.tablesToDownload).length) {
            for (var key in $scope.tablesToDownload) {
                $scope.tablesToDownload[key].length == 0 ? delete $scope.tablesToDownload[key] : ''
            }

            
            $http.post('/api/download_tables', 
                JSON.stringify({queryType: queryType, tables: $scope.tablesToDownload, 
                    limit: $scope.limit, fromDate: $scope.fromDate, toDate: $scope.toDate
                    , sliderId: $scope.sliderId}))
            .success(function(res) {
                if (res.data.length) {
                    $scope.noQueryString = false;
                    $scope.tablePreview = res.data;
                    $scope.tablePreviewColumns = Object.keys(res.data[0])
                } else if(res.sqlString) {
                    $scope.tablePreview = [];
                    $scope.tablePreviewColumns = [];
                    $scope.noQueryString = true;
                    $scope.sqlString = res.sqlString;
                } else {
                    $scope.tablePreview = [];
                    $scope.tablePreviewColumns = [];
                    $scope.noQueryString = false;
                    $scope.sqlString = '';
                    $scope.showData = true;
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


app.directive('loading',   ['$http' ,function ($http)
    {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs)
            {
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (v)
                {
                    if(v){
                        elm.show();
                    }else{
                        elm.hide();
                    }
                });
            }
        };

    }]);
app.directive('allowOnlyNumbers', function () {  
    return {  
        restrict: 'A',  
        link: function (scope, elm, attrs, ctrl) {  
            elm.on('keydown', function (event) {  
                var $input = $(this);  
                var value = $input.val();  
                value = value.replace(/[^0-9]/g, '')  
                $input.val(value);  
                if (event.which == 64 || event.which == 16) {  
                    // to allow numbers  
                    return false;  
                } else if (event.which >= 48 && event.which <= 57) {  
                    // to allow numbers  
                    return true;  
                } else if (event.which >= 96 && event.which <= 105) {  
                    // to allow numpad number  
                    return true;  
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {  
                    // to allow backspace, enter, escape, arrows  
                    return true;  
                } else {  
                    event.preventDefault();  
                    // to stop others  
                    //alert("Sorry Only Numbers Allowed");  
                    return false;  
                }  
            });  
        }  
    }  
}); 