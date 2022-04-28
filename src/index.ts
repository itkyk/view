let emits: Record<string, unknown> = {};

class Base {
  public tag: string;
  public refs: Record<string, HTMLElement >
  private readonly watchFuncs: Record<string, ()=>void>;
  public section: HTMLElement | null | undefined;
  public watch: (() => object) | undefined;
  public style: any;
  public emit: undefined | (()=>Record<string, unknown>);
  constructor(_tag:string) {
    this.tag = _tag;
    this.refs = {}
    this.watchFuncs = {}
  }
  init(cb: ()=>void | null) {
    if (this.section) {
      this.setEmit();
      this.addEvents()
      this.getReference()
      this.setWatch()
      this.setEmotion();
      if (cb) {
        cb();
      }
    }
  }

  private setWatch() {
    if (this.watch !== undefined) {
      const callback = this.watch()
      this.startWatcher(callback)
    }
  }


  private setEmotion = () => {
    let style = null;
    if (this.style) {
      style = this.style();
    }
    if (style) {
      const selector = `[${this.tag}-css]`
      const styleTargets = this.section?.querySelectorAll(selector);
      if (styleTargets) {
        for (const target of styleTargets) {
          const selector = target.getAttribute(`${this.tag}-css`);
          // @ts-ignore
          target.classList.add(style[selector]);
        }
      }
    }
  }

  private startWatcher = (keys: any) => {
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

  private addEvents = () =>{
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
  private getReference() {
    const tag = `${this.tag}-ref`
    if (this.section) {
      const refs = this.section.querySelectorAll(`[${tag}]`) as NodeListOf<HTMLElement>;
      for (const ref of refs) {
        const attribute = ref.getAttribute(tag);
        if (attribute) {
          this.refs[attribute] = ref
        }
      }
    }
  }

  private setEmit = () => {
   if (this.emit !== undefined && typeof this.emit !== "undefined") {
      const emit = this.emit();
      emits = Object.assign(emits, emit);
   }
  }

  view = () => {
    return {
      emit: emits
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