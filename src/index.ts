let emits: Record<string, ()=>unknown> = {};

const refactorDataTag = (_tagName:string) => `[data-view="${_tagName}"]`;

class Base {
  public tag: string;
  public refs: Record<string, HTMLElement >
  private readonly watchFuncs: Record<string, ()=>void>;
  public section: HTMLElement | null | undefined;
  public watch: (() => object) | undefined;
  public style: any;
  public emit: undefined | (()=>Record<string, ()=>unknown>);
  constructor(_tag:string, _section: HTMLElement) {
    this.section = _section;
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
      const selector = `[data-${this.tag}-css]`
      const styleTargets = this.section?.querySelectorAll(selector);
      if (styleTargets) {
        for (const target of styleTargets) {
          const className = target.getAttribute(`data-${this.tag}-css`);
          // @ts-ignore
          target.classList.add(style[className]);
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
      const eventName = `data-${this.tag}-${event}`
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
    const tag = `data-${this.tag}-ref`
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

  private getEmit = (name: string) => {
    return emits[name];
  }

  view = () => {
    return {
      emit: this.getEmit
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

export class Component extends Base{
  constructor(props: any) {
    super(props.tag, props.component);
  }
}

export function createComponent(_tagName: string, _class: any) {
  let targets:NodeListOf<Element>;
  if (!_tagName.includes("#") && !_tagName.includes(".")) {
    targets = document.querySelectorAll(refactorDataTag(_tagName))
  } else {
    targets = document.querySelectorAll(_tagName);
  }
  const refactorTag = _tagName.replace("#","").replace(".","")
  const classes = [];
  for (const target of targets) {
    classes.push(new _class({component: target, tag:refactorTag, isData: _tagName.includes("data-view") ? true : false}));
  }
  return classes;
}