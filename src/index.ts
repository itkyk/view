class Base {
  public tag: string;
  public refs: Record<string, HTMLElement | Element >
  private readonly watchFuncs: Record<string, ()=>void>;
  public section: HTMLElement | null | undefined;
  public watch: (() => object) | undefined;
  constructor(_tag:string) {
    this.tag = _tag;
    this.refs = {}
    this.watchFuncs = {}
  }
  init(cb: ()=>void | null) {
    if (this.section) {
      this._addEvents()
      this.getReference()
      this.setWatch()
      if (cb) {
        cb();
      }
    }
  }
  setWatch() {
    if (this.watch !== undefined) {
      const callback = this.watch()
      this.startWatcher(callback)
    }
  }

  startWatcher = (keys: any) => {
    Object.keys(keys).forEach( (key) => {
      // @ts-ignore
      let lastVal = this[key]
      this.watchFuncs[key] = () => {
        // @ts-ignore
        if (this[key] !== lastVal) {
          // @ts-ignore
          lastVal = this[key]
          keys[key]()
        }
        requestAnimationFrame(this.watchFuncs[key])
      }
      this.watchFuncs[key]();
    })
  }

  removeWatch() {
    Object.keys(this.watchFuncs).forEach((key) => {
      // @ts-ignore
      clearInterval(this.watchFuncs[key])
    })
  }

  _addEvents = () =>{
    const events = ["click", "scroll", "load", "mouseenter", "mouseleave", "mouseover", "change"]
    for (const event of events) {
      const eventName = `${this.tag}-${event}`
      if (this.section !== undefined && this.section !== null) {
        const targets = this.section.querySelectorAll("[" + eventName + "]");
        for (const target of targets) {
          const func:string | null = target.getAttribute(eventName)
          const addFunc = (e: Event) => {
            if (func !== null) {
              // @ts-ignore
              this[func](e);
            }
          }
          target.addEventListener(event, addFunc)
        }
      }
    }
  }
  getReference() {
    const tag = `${this.tag}-ref`
    if (this.section) {
      const refs = this.section.querySelectorAll(`[${tag}]`);
      for (const ref of refs) {
        const attribute = ref.getAttribute(tag);
        if (attribute) {
          this.refs[attribute] = ref
        }
      }
    }
  }
  destroy(){
    // @ts-ignore
    if (this.beforeDestroy) {
      // @ts-ignore
      this.beforeDestroy()
    }
  }


}

export class Page extends Base {
  constructor(_tag: string, num = null) {
    super(_tag)
    this.tag = _tag
    this.section = document.getElementById(_tag);
  }
}

export class Component extends Base{
  constructor(props: any) {
    super(props.tag);
    this.section = props.component;
  }
}

export function createComponent(_tagName: string, _class: any) {
  const targets = document.querySelectorAll(_tagName);
  const refactorTag = _tagName.replace("#","").replace(".","")
  const classes = [];
  if (_tagName.includes("#")) {
    for (const target of targets) {
      classes.push(new _class(refactorTag))
    }
  } else if (_tagName.includes(".")) {
    for (const target of targets) {
      classes.push(new _class({component: target, tag:refactorTag}))
    }
  }
  return classes;
}