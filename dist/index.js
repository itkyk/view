"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = exports.Component = exports.Page = void 0;
var Base = /** @class */ (function () {
    function Base(_tag) {
        var _this = this;
        this.setEmotion = function () {
            var _a;
            var style = null;
            if (_this.style) {
                style = _this.style();
            }
            if (style) {
                var selector = "[".concat(_this.tag, "-css]");
                var styleTargets = (_a = _this.section) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
                if (styleTargets) {
                    for (var _i = 0, styleTargets_1 = styleTargets; _i < styleTargets_1.length; _i++) {
                        var target = styleTargets_1[_i];
                        var selector_1 = target.getAttribute("".concat(_this.tag, "-css"));
                        // @ts-ignore
                        target.classList.add(style[selector_1]);
                    }
                }
            }
        };
        this.startWatcher = function (keys) {
            Object.keys(keys).forEach(function (key) {
                // @ts-ignore
                var lastVal = _this[key];
                _this.watchFuncs[key] = function () {
                    // @ts-ignore
                    if (_this[key] !== lastVal) {
                        // @ts-ignore
                        lastVal = _this[key];
                        keys[key]();
                    }
                    requestAnimationFrame(_this.watchFuncs[key]);
                };
                _this.watchFuncs[key]();
            });
        };
        this._addEvents = function () {
            var events = ["click", "scroll", "load", "mouseenter", "mouseleave", "mouseover", "change"];
            for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
                var event_1 = events_1[_i];
                var eventName = "".concat(_this.tag, "-").concat(event_1);
                if (_this.section !== undefined && _this.section !== null) {
                    var targets = _this.section.querySelectorAll("[" + eventName + "]");
                    var _loop_1 = function (target) {
                        var func = target.getAttribute(eventName);
                        var addFunc = function (e) {
                            if (func !== null) {
                                // @ts-ignore
                                _this[func](e);
                            }
                        };
                        target.addEventListener(event_1, addFunc);
                    };
                    for (var _a = 0, targets_1 = targets; _a < targets_1.length; _a++) {
                        var target = targets_1[_a];
                        _loop_1(target);
                    }
                }
            }
        };
        this.tag = _tag;
        this.refs = {};
        this.watchFuncs = {};
    }
    Base.prototype.init = function (cb) {
        if (this.section) {
            this._addEvents();
            this.getReference();
            this.setWatch();
            this.setEmotion();
            if (cb) {
                cb();
            }
        }
    };
    Base.prototype.setWatch = function () {
        if (this.watch !== undefined) {
            var callback = this.watch();
            this.startWatcher(callback);
        }
    };
    Base.prototype.removeWatch = function () {
        var _this = this;
        Object.keys(this.watchFuncs).forEach(function (key) {
            // @ts-ignore
            clearInterval(_this.watchFuncs[key]);
        });
    };
    Base.prototype.getReference = function () {
        var tag = "".concat(this.tag, "-ref");
        if (this.section) {
            var refs = this.section.querySelectorAll("[".concat(tag, "]"));
            for (var _i = 0, refs_1 = refs; _i < refs_1.length; _i++) {
                var ref = refs_1[_i];
                var attribute = ref.getAttribute(tag);
                if (attribute) {
                    this.refs[attribute] = ref;
                }
            }
        }
    };
    Base.prototype.destroy = function () {
        // @ts-ignore
        if (this.beforeDestroy) {
            // @ts-ignore
            this.beforeDestroy();
        }
    };
    return Base;
}());
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page(_tag, num) {
        if (num === void 0) { num = null; }
        var _this = _super.call(this, _tag) || this;
        _this.tag = _tag;
        _this.section = document.getElementById(_tag);
        return _this;
    }
    return Page;
}(Base));
exports.Page = Page;
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(props) {
        var _this = _super.call(this, props.tag) || this;
        _this.section = props.component;
        return _this;
    }
    return Component;
}(Base));
exports.Component = Component;
function createComponent(_tagName, _class) {
    var targets = document.querySelectorAll(_tagName);
    var refactorTag = _tagName.replace("#", "").replace(".", "");
    var classes = [];
    if (_tagName.includes("#")) {
        for (var _i = 0, targets_2 = targets; _i < targets_2.length; _i++) {
            var target = targets_2[_i];
            classes.push(new _class(refactorTag));
        }
    }
    else if (_tagName.includes(".")) {
        for (var _a = 0, targets_3 = targets; _a < targets_3.length; _a++) {
            var target = targets_3[_a];
            classes.push(new _class({ component: target, tag: refactorTag }));
        }
    }
    return classes;
}
exports.createComponent = createComponent;
