"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponent = exports.Component = exports.Page = void 0;
class Base {
    constructor(_tag) {
        this.setEmotion = () => {
            var _a;
            let style = null;
            if (this.style) {
                style = this.style();
            }
            if (style) {
                const selector = `[${this.tag}-css]`;
                const styleTargets = (_a = this.section) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selector);
                if (styleTargets) {
                    for (const target of styleTargets) {
                        const selector = target.getAttribute(`${this.tag}-css`);
                        // @ts-ignore
                        target.classList.add(style[selector]);
                    }
                }
            }
        };
        this.startWatcher = (keys) => {
            Object.keys(keys).forEach((key) => {
                // @ts-ignore
                let lastVal = this[key];
                this.watchFuncs[key] = () => {
                    // @ts-ignore
                    if (this[key] !== lastVal) {
                        // @ts-ignore
                        lastVal = this[key];
                        keys[key]();
                    }
                    requestAnimationFrame(this.watchFuncs[key]);
                };
                this.watchFuncs[key]();
            });
        };
        this._addEvents = () => {
            const events = ["click", "scroll", "load", "mouseenter", "mouseleave", "mouseover", "change"];
            for (const event of events) {
                const eventName = `${this.tag}-${event}`;
                if (this.section !== undefined && this.section !== null) {
                    const targets = this.section.querySelectorAll("[" + eventName + "]");
                    for (const target of targets) {
                        const func = target.getAttribute(eventName);
                        const addFunc = (e) => {
                            if (func !== null) {
                                // @ts-ignore
                                this[func](e);
                            }
                        };
                        target.addEventListener(event, addFunc);
                    }
                }
            }
        };
        this.tag = _tag;
        this.refs = {};
        this.watchFuncs = {};
    }
    init(cb) {
        if (this.section) {
            this._addEvents();
            this.getReference();
            this.setWatch();
            this.setEmotion();
            if (cb) {
                cb();
            }
        }
    }
    setWatch() {
        if (this.watch !== undefined) {
            const callback = this.watch();
            this.startWatcher(callback);
        }
    }
    removeWatch() {
        Object.keys(this.watchFuncs).forEach((key) => {
            // @ts-ignore
            clearInterval(this.watchFuncs[key]);
        });
    }
    getReference() {
        const tag = `${this.tag}-ref`;
        if (this.section) {
            const refs = this.section.querySelectorAll(`[${tag}]`);
            for (const ref of refs) {
                const attribute = ref.getAttribute(tag);
                if (attribute) {
                    this.refs[attribute] = ref;
                }
            }
        }
    }
    destroy() {
        // @ts-ignore
        if (this.beforeDestroy) {
            // @ts-ignore
            this.beforeDestroy();
        }
    }
}
class Page extends Base {
    constructor(_tag, num = null) {
        super(_tag);
        this.tag = _tag;
        this.section = document.getElementById(_tag);
    }
}
exports.Page = Page;
class Component extends Base {
    constructor(props) {
        super(props.tag);
        this.section = props.component;
    }
}
exports.Component = Component;
function createComponent(_tagName, _class) {
    const targets = document.querySelectorAll(_tagName);
    const refactorTag = _tagName.replace("#", "").replace(".", "");
    const classes = [];
    if (_tagName.includes("#")) {
        for (const target of targets) {
            classes.push(new _class(refactorTag));
        }
    }
    else if (_tagName.includes(".")) {
        for (const target of targets) {
            classes.push(new _class({ component: target, tag: refactorTag }));
        }
    }
    return classes;
}
exports.createComponent = createComponent;
