/*global moment:true */
describe('Datepicker', function () {
    var loadTemplate = function (url) {
        var $window = angular.injector(['ng']).get('$window');
        var response = null;

        var xhr = new $window.XMLHttpRequest();
        xhr.onload = function () {
            response = this.responseText;
        };
        xhr.open('GET', url, false);
        xhr.send();
        return response;
    };

    var compileTemplate = function (html, compile, scope) {
        var element = compile(angular.element(html))(scope);
        scope.$digest();
        return element;
    };

    beforeEach(module('datepicker'));

    describe('directive', function () {
        var realMoment, rootScope, compile, templateCache;
        beforeEach(inject(function ($rootScope, $compile, $templateCache) {
            realMoment = moment;
            compile = $compile;
            rootScope = $rootScope;
            compile = $compile;
            templateCache = $templateCache;

            moment = function () {
                return realMoment().year(2013).month(1);
            };

            moment.isMoment = realMoment.isMoment;

            templateCache.put('datepicker.html', loadTemplate('base/datepicker.html'));
            this.outerScope = rootScope.$new();
            this.element = compileTemplate('<date-picker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ"></date-picker>', compile, this.outerScope);

            this.scope = this.element.isolateScope();
        }));

        afterEach(function () {
            moment = realMoment;
        });

        describe('valid date range', function () {
            beforeEach(function () {
                templateCache.put('datepicker.html', loadTemplate('base/datepicker.html'));
                this.outerScope = rootScope.$new();
                this.element = compileTemplate('<date-picker ng-model="chosenDate" date-format="YYYY-MM-DDTHH:mm:ss.SSSZZ" earliest-date="2013-01-01" latest-date="2013-03-31"></date-picker>', compile, this.outerScope);
                this.scope = this.element.isolateScope();
            });

            it('may have a start date', function () {
                expect(realMoment.isMoment(this.scope.earliestDate));
                expect(realMoment('2013-01-01').startOf('day').isSame(this.scope.earliestDate)).toBeTruthy();
            });

            it('may have an end date', function () {
                expect(realMoment.isMoment(this.scope.latestDate));
                expect(realMoment('2013-03-31').startOf('day').isSame(this.scope.latestDate)).toBeTruthy();
            });

            describe('view', function () {
                it('should not apply the invalid class to valid dates', function () {
                    expect(this.element.find('.dates li:nth(1)').is(':not(.invalid)')).toBeTruthy();
                });

                it('should apply the invalid class to invalid dates', function () {
                    this.element.find('.nextMonth').click();
                    this.element.find('.nextMonth').click();
                    expect(this.element.find('.dates li:nth(1)').is('.invalid')).toBeTruthy();
                });

                it('should not select invalid dates', function () {
                    this.element.find('.nextMonth').click();
                    this.element.find('.nextMonth').click();
                    this.element.find('.dates li:nth(9)').click();
                    expect(this.outerScope.chosenDate).toBeUndefined();
                });
            });
        });

        describe('initialize', function () {
            it('should set year to the current year', function () {
                expect(this.scope.year()).toEqual('2013');
            });

            it('should set selectedMonth to the current', function () {
                expect(this.scope.month()).toEqual('February');
            });

            it('should populate dates with the dates of the selectedMonth', function () {
                expect(this.scope.dates()[5].date).toEqual(1);
                expect(this.scope.dates()[32].date).toEqual(28);
            });

            it('should populate days before the 1st of the selectedMonth with the dates of the previous month', function () {
                expect(this.scope.dates()[0].date).toEqual(27);
                expect(this.scope.dates()[4].date).toEqual(31);
            });

            it('should populate dates after the end of the selectedMonth with the dates of the next month', function () {
                expect(this.scope.dates()[33].date).toEqual(1);
                expect(this.scope.dates()[34].date).toEqual(2);
            });

            it('should set the date format', function () {
                expect(this.scope.dateFormat).toEqual('YYYY-MM-DDTHH:mm:ss.SSSZZ');
            });
        });

        describe('#nextMonth', function () {
            it('should increment the selected month', function () {
                this.scope.nextMonth();
                this.scope.nextMonth();
                expect(this.scope.month()).toEqual('April');
            });

            it('should increment the selected year when the selected month is December', function () {
                this.scope.selectedMonth.month(11);
                this.scope.nextMonth();
                expect(this.scope.month()).toEqual('January');
                expect(this.scope.year()).toEqual('2014');
            });
        });

        describe('#previousMonth', function () {
            it('should decrement the selectedMonth', function () {
                this.scope.previousMonth();
                this.scope.previousMonth();
                expect(this.scope.month()).toEqual('December');
            });

            it('should decrement the selected year when the selected month is January', function () {
                this.scope.selectedMonth.month(0);
                this.scope.previousMonth();
                expect(this.scope.month()).toEqual('December');
                expect(this.scope.year()).toEqual('2012');
            });
        });

        describe('#month', function () {
            it('should return the text value of the selected month', function () {
                expect(this.scope.month()).toEqual('February');
            });
        });

        describe('#year', function () {
            it('should return the selected year', function () {
                expect(this.scope.year()).toEqual('2013');
            });
        });

        describe('#isWeekend', function () {
            it('should return true if date is a Saturday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[6].moment)).toBeTruthy();
            });

            it('should return true if date is a Sunday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[7].moment)).toBeTruthy();
            });

            it('should return false if date is not a Saturday or Sunday', function () {
                expect(this.scope.isWeekend(this.scope.dates()[1].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[2].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[3].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[4].moment)).toBeFalsy();
                expect(this.scope.isWeekend(this.scope.dates()[5].moment)).toBeFalsy();
            });
        });

        describe('#isValid', function () {
            it('should invalidate dates outside of the valid date range', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2012-12-31'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2012-04-01'))).toBeFalsy();
            });

            it('should validate dates inside of the valid date range', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2012-01-01'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2012-03-31'))).toBeFalsy();
            });

            it('should validate all dates when there is neither earliest or latest date', function () {
                this.scope.earliestDate = undefined;
                this.scope.latestDate = undefined;
                expect(this.scope.isValid(realMoment('2012-01-01'))).toBeTruthy();
                expect(this.scope.isValid(realMoment('2012-03-31'))).toBeTruthy();
            });

            it('should validate all dates after earliest date when there is only an earliest date', function () {
                this.scope.earliestDate = realMoment('2013-01-01');
                this.scope.latestDate = undefined;
                expect(this.scope.isValid(realMoment('2012-12-31'))).toBeFalsy();
                expect(this.scope.isValid(realMoment('2013-01-01'))).toBeTruthy();
            });

            it('should validate all dates before latest date when there is only an latest date', function () {
                this.scope.earliestDate = undefined;
                this.scope.latestDate = realMoment('2013-03-31');
                expect(this.scope.isValid(realMoment('2013-03-31'))).toBeTruthy();
                expect(this.scope.isValid(realMoment('2013-04-01'))).toBeFalsy();
            });
        });

        describe('view', function () {
            it('should display the select month name', function () {
                expect(this.element.find('.month').text()).toEqual('February');
            });

            it('should display the selected year', function () {
                expect(this.element.find('.year').text()).toEqual('2013');
            });

            it('should display the dates in the selected month', function () {
                expect(this.element.find('.dates li:nth(5)').text()).toEqual('1');
                expect(this.scope.dates()[5].date).toEqual(1);
            });

            it('should display the dates in the previous month when next previous is clicked', function () {
                this.element.find('.previousMonth').click();
                expect(this.element.find('.month').text()).toEqual('January');
                expect(this.element.find('.dates li:nth(2)').text()).toEqual('1');
                expect(this.scope.dates()[2].date).toEqual(1);
            });

            it('should display the dates in the next month when next next is clicked', function () {
                this.element.find('.nextMonth').click();
                this.element.find('.nextMonth').click();
                expect(this.element.find('.month').text()).toEqual('April');
                expect(this.element.find('.dates li:nth(1)').text()).toEqual('1');
                expect(this.scope.dates()[1].date).toEqual(1);
            });

            it('should select the date as the moment when a date is clicked', function () {
                this.scope.dateFormat = undefined;
                this.element.find('.dates li:nth(9)').click();
                expect(realMoment('2013-02-05').isSame(this.outerScope.chosenDate)).toBeTruthy();
            });

            it('should select the date when a date is clicked', function () {
                this.element.find('.dates li:nth(5)').click();
                expect(this.outerScope.chosenDate).toEqual('2013-02-01T00:00:00.000+0200');
            });

            it('should select the date in a custom format when a date is clicked', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.outerScope.chosenDate).toEqual('06 February 2013');
            });

            it('should update the input when a date is selected', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.element.find('input').val()).toEqual('06 February 2013');
            });

            it('should highlight the selected date', function () {
                this.scope.dateFormat = 'DD MMMM YYYY';
                this.element.find('.dates li:nth(10)').click();
                expect(this.element.find('.dates li:nth(10)').is('.selected')).toBeTruthy();
            });

            it('should apply weekend class to Saturdays', function () {
                expect(this.element.find('.dates li:nth(6)').is('.weekend')).toBeTruthy();
            });

            it('should apply weekend class to Sundays', function () {
                expect(this.element.find('.dates li:nth(7)').is('.weekend')).toBeTruthy();
            });

            it('should have disabled input', function () {
                expect(this.element.find('input').attr('readonly')).toBeTruthy();
            });

            it('should not display the datepicker initially', function () {
                expect(this.element.find('.datepicker').hasClass('ng-hide')).toBeTruthy();
            });

            it('should display the datepicker when the input is clicked', function () {
                this.element.find('input').click();
                expect(this.element.find('.datepicker').hasClass('ng-hide')).toBeFalsy();
            });

            it('should mark days that are not in the month selected with the different-month class', function () {
                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeTruthy();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeTruthy();
            });

            it('should not mark invalid days that are not in the month selected with the different-month class', function () {
                this.scope.earliestDate = realMoment('2013-01-31');
                this.scope.latestDate = realMoment('2013-03-01');
                this.scope.$digest();

                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeFalsy();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeFalsy();
            });

            it('should not mark selected date with the different-month class', function () {
                this.element.find('.dates li:nth(0)').click();
                expect(this.element.find('.dates li:nth(0)').is('.different-month')).toBeFalsy();

                this.element.find('.dates li:nth(34)').click();
                expect(this.element.find('.dates li:nth(34)').is('.different-month')).toBeFalsy();
            });

            it('should not apply weekend class to days that are not Saturday or Sunday', function () {
                expect(this.element.find('.dates li:nth(1)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(2)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(3)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(4)').is(':not(.weekend)')).toBeTruthy();
                expect(this.element.find('.dates li:nth(5)').is(':not(.weekend)')).toBeTruthy();
            });
        });
    });

});