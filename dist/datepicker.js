/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	var DatePicker = angular.module('datepicker', []);

	DatePicker.component('datePicker', {
	    templateUrl: __webpack_require__(5),
	    controller: DatePickerController,
	    restrict: "E",
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

	module.exports = DatePicker;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./datepicker.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./datepicker.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".datepicker {\n    position: absolute;\n    width: 21em;\n    height: 21em;\n    line-height: 3em;\n    background-color: #fff;\n    color: #1e1e1e;\n    margin-top: 0.5em;\n    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.25);\n    z-index: 9999;\n}\n.datepicker .header {\n    background-color: #f3f3f3;\n    height: 3em;\n    text-align: center;\n}\n.datepicker .header i {\n    margin-top: 0.5em;\n    margin-left: 0.5em;\n    margin-right: 0.5em;\n}\n.datepicker .header i:hover {\n    cursor: pointer;\n}\n.datepicker .header i.right {\n    right: 0;\n}\n.datepicker .header button {\n    background-color: #f3f3f3;\n    color: #333;\n    font-weight: bold;\n    padding: 0em;\n    width: 4em;\n    height: 3em;\n    border: none;\n}\n.datepicker .header button.month {\n    font-size: 14px;\n    width: 6em;\n    border-right: none;\n}\n.datepicker .header button.year {\n    font-size: 14px;\n    width: 3em;\n    border-left: none;\n}\n.datepicker .days {\n    margin: 0;\n    padding-left: 0;\n    width: 21em;\n}\n.datepicker .days li {\n    list-style: none;\n    font-weight: bold;\n    float: left;\n    width: 3em;\n    height: 3em;\n    text-align: center;\n}\n.datepicker .dates {\n    margin: 0;\n    padding-left: 0;\n    width: 21em;\n}\n.datepicker .dates li {\n    list-style: none;\n    float: left;\n    width: 3em;\n    height: 3em;\n    text-align: center;\n    cursor: pointer;\n}\n.datepicker .dates li:hover {\n    background-color: #f3f3f3;\n}\n.datepicker .dates li.different-month {\n    color: #bbb;\n}\n.datepicker .dates li.invalid {\n    color: #D2D2D2;\n    cursor: not-allowed;\n}\n.datepicker .dates li.invalid:hover {\n    background-color: white;\n}\n.datepicker .dates li.selected {\n    background-color: #9FD6FF;\n    color: white;\n}\n.datepicker .fa {\n    font-size: 0.9em;\n    padding: 0.7em;\n    position: absolute;\n    color: #424242;\n}\n.datepicker .fa.left {\n    left: 0;\n}\n\n.datepicker-input {\n    position: relative;\n    width: 14em;\n    padding-bottom: 0;\n}\n.datepicker-input input[type=text] {\n    transition: background 0.3s ease-in-out;\n    font-size: 1em;\n    background: none;\n    background-color: #FDFDFD;\n    border: 1px solid #D2D2D2;\n    padding: 0.7em;\n    margin-bottom: 0em;\n    outline: none;\n    width: 100%;\n}\n.datepicker-input:after {\n    font-family: \"fontawesome\";\n    content: \"\\F073\";\n    font-size: 1.5em;\n    position: absolute;\n    top: 0.5em;\n    right: -0.5em;\n    pointer-events: none;\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "<div class=\"datepicker-input\">\n    <input type=\"text\" ng-model=\"$ctrl.ngModel\" ng-readonly=\"true\" ng-click=\"$ctrl.showPicker()\" ng-focus=\"$ctrl.showPicker()\"  />\n</div>\n<div class=\"datepicker\" ng-show=\"$ctrl.selecting\">\n    <div class=\"header\">\n        <i class=\"previousMonth fa fa-chevron-left left\" ng-click=\"$ctrl.previousMonth()\"></i>\n        <button type=\"button\" class=\"month\">{{ $ctrl.month() }}</button>\n        <button type=\"button\" class=\"year\">{{ $ctrl.year() }}</button>\n        <i class=\"nextMonth right fa fa-chevron-right\" ng-click=\"$ctrl.nextMonth()\"></i>\n    </div>\n    <ul class=\"days\">\n        <li class=\"weekend\">S</li>\n        <li>M</li>\n        <li>T</li>\n        <li>W</li>\n        <li>T</li>\n        <li>F</li>\n        <li class=\"weekend\">S</li>\n    </ul>\n    <ul class=\"dates\">\n        <li ng-repeat=\"date in $ctrl.dates()\" ng-click=\"$ctrl.selectDate(date.moment)\" ng-class=\"$ctrl.dateClass(date.moment)\">{{ date.date }}</li>\n    </ul>\n</div>";

/***/ }
/******/ ]);