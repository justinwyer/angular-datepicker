(function (app) {
    app.component('datePicker', {
            templateUrl: 'datepicker.html',
            controller: DatePickerController,
            bindings: {
                ngModel: '=',
                earliestDate: '@',
                latestDate: '@',
                dateFormat: '@'
            }
        });

    function DatePickerController ($scope, $element, $attrs) {
        var ctrl = this;

        var clickedOutsideOfPickerOrInputBox = function (element, event) {
            var picker = $element.find('.datepicker')[0];
            var input = $element.find('input')[0];

            return !picker.contains(event.target) && !input.contains(event.target);
        };

        var clickingOutsideHandler = function (event) {
            if (clickedOutsideOfPickerOrInputBox($element, event)) {
                ctrl.hidePicker();
                ctrl.$apply();
            }
        };
        
        ctrl.$postLink = function () {
            $element.on('click', clickingOutsideHandler);
        }
        
        ctrl.$onDestroy = function () {
            $element.off('click', clickingOutsideHandler);
        }
        
        ctrl.year = function () {
            return ctrl.selectedMonth.format('YYYY');
        };

        ctrl.month = function () {
            return ctrl.selectedMonth.format('MMMM');
        };

        ctrl.nextMonth = function () {
            ctrl.selectedMonth = ctrl.selectedMonth.add(1, 'month').clone();
            populateDays(ctrl.selectedMonth);
        };

        ctrl.previousMonth = function () {
            ctrl.selectedMonth = ctrl.selectedMonth.subtract(1, 'month').clone();
            populateDays(ctrl.selectedMonth);
        };

        ctrl.selectDate = function (date) {
            if (ctrl.isValid(date)) {
                ctrl.ngModel = ctrl.dateFormat ? date.format(ctrl.dateFormat) : date;
                ctrl.hidePicker();
            }
        };

        ctrl.isWeekend = function (date) {
            return date.weekday() == 0 || date.weekday() == 6;
        };

        ctrl.isValid = function (date) {
            if (!ctrl.earliestDate && !ctrl.latestDate) {
                return true;
            } else if (!ctrl.earliestDate) {
                return !date.isAfter(ctrl.latestDate);
            } else if (!ctrl.latestDate) {
                return !date.isBefore(ctrl.earliestDate);
            } else {
                return !date.isBefore(ctrl.earliestDate) && !date.isAfter(ctrl.latestDate);
            }
        };

        ctrl.showPicker = function () {
            ctrl.selecting = true;
        };

        ctrl.hidePicker = function () {
            ctrl.selecting = false;
        };

        ctrl.dateClass = function (date) {
            if (!ctrl.isValid(date)) {
                return 'invalid';
            }
            if (date.isSame(ctrl.ngModel)) {
                return 'selected';
            }
            if (date.month() != ctrl.selectedMonth.month()) {
                return 'different-month';
            }
            if (ctrl.isWeekend(date)) {
                return 'weekend';
            }
            return '';
        };

        var _dates = [];

        ctrl.dates = function () {
            return _dates;
        };
        
        var populateDays = function(model) {
            var _month = model.clone();
            while(_dates.length > 0) {
                _dates.pop();
            }
            var calendarDate = _month.date(1).subtract(_month.date(1).day(), 'days');
            for (var i = 0; i < 35; i++) {
                _dates.push({moment: calendarDate.clone().startOf('day'), date: calendarDate.date()});
                calendarDate.add(1, 'days');
            }
        }

        ctrl.selectedMonth = moment();
        populateDays(ctrl.selectedMonth)
        ctrl.earliestDate = ctrl.earliestDate ? moment(ctrl.earliestDate, 'YYYY-MM-DD').startOf('day') : undefined;
        ctrl.latestDate = ctrl.latestDate ? moment(ctrl.latestDate, 'YYYY-MM-DD').endOf('day') : undefined;
    }
})(angular.module('datepicker', []));