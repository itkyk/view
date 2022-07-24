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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = exports.Component = void 0;
var emits = {};
var refactorDataTag = function (_tagName) { return "[data-view=\"".concat(_tagName, "\"]"); };
var Base = /** @class */ (function () {
    function Base(_tag, _section) {
        var _this = this;
        this.setEmotion = function () {
            var e_1, _a;
            var _b;
            var style = null;
            if (_this.style) {
                style = _this.style();
            }
            if (style) {
                var selector = "[data-".concat(_this.tag, "-css]");
                var styleTargets = (_b = _this.section) === null || _b === void 0 ? void 0 : _b.querySelectorAll(selector);
                if (styleTargets) {
                    try {
                        for (var styleTargets_1 = __values(styleTargets), styleTargets_1_1 = styleTargets_1.next(); !styleTargets_1_1.done; styleTargets_1_1 = styleTargets_1.next()) {
                            var target = styleTargets_1_1.value;
                            var className = target.getAttribute("data-".concat(_this.tag, "-css"));
                            // @ts-ignore
                            target.classList.add(style[className]);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (styleTargets_1_1 && !styleTargets_1_1.done && (_a = styleTargets_1.return)) _a.call(styleTargets_1);
                        }
                        finally { if (e_1) throw e_1.error; }
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
        this.addEvents = function () {
            var e_2, _a, e_3, _b;
            var events = ["click", "scroll", "load", "mouseenter", "mouseleave", "mouseover", "change"];
            try {
                for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                    var event_1 = events_1_1.value;
                    var eventName = "data-".concat(_this.tag, "-").concat(event_1);
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
                        try {
                            for (var targets_1 = (e_3 = void 0, __values(targets)), targets_1_1 = targets_1.next(); !targets_1_1.done; targets_1_1 = targets_1.next()) {
                                var target = targets_1_1.value;
                                _loop_1(target);
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (targets_1_1 && !targets_1_1.done && (_b = targets_1.return)) _b.call(targets_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        this.setEmit = function () {
            if (_this.emit !== undefined && typeof _this.emit !== "undefined") {
                var emit = _this.emit();
                emits = Object.assign(emits, emit);
            }
        };
        this.getEmit = function (name) {
            return emits[name];
        };
        this.view = function () {
            return {
                emit: _this.getEmit
            };
        };
        this.section = _section;
        this.tag = _tag;
        this.refs = {};
        this.watchFuncs = {};
    }
    Base.prototype.init = function (cb) {
        if (this.section) {
            this.setEmit();
            this.addEvents();
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
        var e_4, _a;
        var tag = "data-".concat(this.tag, "-ref");
        if (this.section) {
            var refs = this.section.querySelectorAll("[".concat(tag, "]"));
            try {
                for (var refs_1 = __values(refs), refs_1_1 = refs_1.next(); !refs_1_1.done; refs_1_1 = refs_1.next()) {
                    var ref = refs_1_1.value;
                    var attribute = ref.getAttribute(tag);
                    if (attribute) {
                        this.refs[attribute] = ref;
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (refs_1_1 && !refs_1_1.done && (_a = refs_1.return)) _a.call(refs_1);
                }
                finally { if (e_4) throw e_4.error; }
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
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(props) {
        return _super.call(this, props.tag, props.component) || this;
    }
    return Component;
}(Base));
exports.Component = Component;
function createComponent(_tagName, _class) {
    var e_5, _a;
    var targets;
    if (!_tagName.includes("#") && !_tagName.includes(".")) {
        targets = document.querySelectorAll(refactorDataTag(_tagName));
    }
    else {
        targets = document.querySelectorAll(_tagName);
    }
    var refactorTag = _tagName.replace("#", "").replace(".", "");
    var classes = [];
    try {
        for (var targets_2 = __values(targets), targets_2_1 = targets_2.next(); !targets_2_1.done; targets_2_1 = targets_2.next()) {
            var target = targets_2_1.value;
            classes.push(new _class({ component: target, tag: refactorTag, isData: _tagName.includes("data-view") ? true : false }));
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (targets_2_1 && !targets_2_1.done && (_a = targets_2.return)) _a.call(targets_2);
        }
        finally { if (e_5) throw e_5.error; }
    }
    return classes;
}
exports.createComponent = createComponent;
