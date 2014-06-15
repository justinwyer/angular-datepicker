(function (app) {
    app.directive('datePicker', function ($document) {

        var clickedOutsideOfPickerOrInputBox = function (element, event) {
            var picker = element.find('.datepicker')[0];
            var input = element.find('input')[0];

            return !picker.contains(event.target) && !input.contains(event.target);
        };

        return {
            require: '?ngModel',
            templateUrl: 'datepicker.html',
            link: function (scope, element, attributes, ngModel) {
                scope.dateFormat = attributes['dateFormat'];

                var clickingOutsideHandler = function (event) {
                    if (clickedOutsideOfPickerOrInputBox(element, event)) {
                        scope.hidePicker();
                        scope.$apply();
                    }
                };

                $document.on('click', clickingOutsideHandler);
                scope.$on('$destroy', function () {
                    $document.off('click', clickingOutsideHandler);
                });
            },
            controller: 'DatepickerController',
            restrict: "E",
            scope: {
                ngModel: '=',
                earliestDate: '@',
                latestDate: '@'
            }
        }
    });

    app.controller('DatepickerController', function ($scope) {
        $scope.year = function () {
            return $scope.selectedMonth.format('YYYY');
        };

        $scope.month = function () {
            return $scope.selectedMonth.format('MMMM');
        };

        $scope.nextMonth = function () {
            $scope.selectedMonth = $scope.selectedMonth.add('month', 1).clone();
        };

        $scope.previousMonth = function () {
            $scope.selectedMonth = $scope.selectedMonth.subtract('month', 1).clone();
        };

        $scope.selectDate = function (date) {
            if ($scope.isValid(date)) {
                $scope.ngModel = $scope.dateFormat ? date.format($scope.dateFormat) : date;
                $scope.hidePicker();
            }
        };

        $scope.isWeekend = function (date) {
            return date.weekday() == 0 || date.weekday() == 6;
        };

        $scope.isValid = function (date) {
            if (!$scope.earliestDate && !$scope.latestDate) {
                return true;
            } else if (!$scope.earliestDate) {
                return !date.isAfter($scope.latestDate);
            } else if (!$scope.latestDate) {
                return !date.isBefore($scope.earliestDate);
            } else {
                return !date.isBefore($scope.earliestDate) && !date.isAfter($scope.latestDate);
            }
        };

        $scope.showPicker = function () {
            $scope.selecting = true;
        };

        $scope.hidePicker = function () {
            $scope.selecting = false;
        };

        $scope.dateClass = function (date) {
            if (!$scope.isValid(date)) {
                return 'invalid';
            }
            if (date.isSame($scope.ngModel)) {
                return 'selected';
            }
            if (date.month() != $scope.selectedMonth.month()) {
                return 'different-month';
            }
            if ($scope.isWeekend(date)) {
                return 'weekend';
            }
            return '';
        };

        var _dates = [];

        $scope.dates = function () {
            return _dates;
        };

        $scope.$watch('selectedMonth', function (newMonth) {
            var _month = newMonth.clone();
            while(_dates.length > 0) {
                _dates.pop();
            }
            var calendarDate = _month.date(1).subtract('days', _month.date(1).day());
            for (var i = 0; i < 35; i++) {
                _dates.push({moment: calendarDate.clone().startOf('day'), date: calendarDate.date()});
                calendarDate.add('days', 1);
            }
        });

        $scope.selectedMonth = moment();
        $scope.earliestDate = $scope.earliestDate ? moment($scope.earliestDate).startOf('day') : undefined;
        $scope.latestDate = $scope.latestDate ? moment($scope.latestDate).endOf('day') : undefined;
    });
})(angular.module('datepicker', []));