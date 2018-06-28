'use strict';

var module = angular.module('antix.select.multiple', [
])
    .directive(
        'selectMultiple',
        [
            '$log', '$parse',
            function ($log, $parse) {

                return {
                    restrict: 'A',
                    scope: {},
                    require: 'ngModel',
                    template: '<span><input type="checkbox" ng-model="checked" /></span>',
                    replace: true,
                    link: function (scope, element, attrs, ngModel) {

                        var value = $parse(attrs.selectMultiple)(scope.$parent),
                            contains = function (items, item) {
                                if (angular.isArray(items)) {
                                    for (var i = items.length; i--; i >= 0) {
                                        if (angular.equals(items[i], item))
                                            return true;
                                    }
                                }
                                return false;
                            },
                            add = function (items, item) {
                                items = angular.isArray(items) ? items : [];
                                if (!contains(items, item))
                                    items.push(item);

                                return items;
                            },
                            remove = function (items, item) {
                                if (angular.isArray(items)) {
                                    for (var i = items.length; i--;) {
                                        if (angular.equals(items[i], item)) {
                                            items.splice(i, 1);
                                            break;
                                        }
                                    }
                                }
                                return items;
                            };

                        ngModel.$render = function () {
                            scope.checked = contains(ngModel.$modelValue, value);
                        };

                        scope.$watch('checked', function (newValue, oldValue) {
                            if (newValue === oldValue) return;

                            var items = newValue
                                ? add(ngModel.$modelValue, value)
                                : remove(ngModel.$modelValue, value);

                            ngModel.$setViewValue(items);
                        });
                    }
                };
            }
        ]);