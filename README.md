# @itkyk/view

<p>
This module is JavaScript library.<br/>
It is designed based on component orientation.
We recommend that you design your existing HTML template engine with Atomic design and use this library together.
</p>

## Install
```bash
$ npm i @itkyk/view
```

## How to use this module.

```html
<div data-view="sample"></div>
```

```typescript
import View from "@itkyk/view";
// OR
const View = require("@itkyk/view");

View.createComponent("sample", class extends View.Component {
  constructor(props) {
    super(props);
    this.init(()=> {
      console.log("Hello, World!") // output console "Hello,World!"
    })
  }
})
```

## Methods
### Ref
```html
<div data-view="sample">
  <h1 data-sample-ref="title">Hello, World!</h1>
</div> 
```

```typescript
View.creareComponent("sample", class extends View.Component {
  constructor(props) {
    super(props);
    this.init(() => {
      this.getHeaderText(); // output console "Hello, World!";
    })
  }
  
  getHeaderText = () => {
    const text = this.refs.title.innerText;
    console.log(text)
  }
})
```

### Events
When add events for Node, you should set `Data Attributes`.
<br/>
<br/>
**HTML**
```html
<div data-{data-view Name}-{eventName}="functionName"></div>
```

#### Example
```html
<div data-view="sample">
  <!--- When you click button, popup "You clicked Alert! button." --->
  <button type="button" data-sample-click="onClick">Alert!</button>
</div>
```

```typescript
createComponent("sample", class extends View.Component {
  constructor(props) {
    super(props);
    this.init(() => {});
  }
  
  onClick = (e: Event) => {
    const target = e.target;
    const text = `You clicked ${target.innerText} button.`
    alert(text);
  }
})
```
#### Event Type
| event | ex |
|--------|--------|
| click | data-xx-click |
| scroll | data-xx-scroll |
| load | data-xx-load |
| mouseenter | data-xx-mouseenter |
|mouseleave | data-xx-mouseleave |
| mouseover | data-xx-mouseover |
| change | data-xx-change |

## Watch

This library has `watch` function like a `NuxtJS`.

```typescript
createComponent("sample", class extends View.Component {
  private count: number;
  constructor(props) {
    super(props);
    this.count = 0;
    this.init(()=>{
      this.setCountUp();
    });
  }
  
  watch = () => {
    return {
      count: () => {
        // when this.count is updated, 
        // the function is executed below.
        console.log(`count: ${this.count}`);
      }
    }
  }
  
  setCountUp = () => {
    setInterval(() => {
      this.count ++;
    }, 1000)
  }
})
```

### style
This library includes `EmotionJS`.

```html
<div data-view="sample">
  <div data-sample-css="red-block"></div>
  <div data-sample-css="blue-block"></div>
  <div data-sample-css="green-block"></div>
</div>
```

```typescript
import {css} from "@emotion/css";
createComponent("sample", class extends View.Component {
  constructor(props) {
    super(props);
    this.init(()=>{});
  }
  
  style = () => {
    const block = css({
      width: "100px",
      height: "100px"
    })
    return {
      "red-block": css(block, {
        backgroundColor: "red"
      }),
      "blue-block": css(clock, {
        backgroundColor: "blue"
      }),
      "green-block"; css(block, {
        backgroundColor: "greeen"
      })
    }
  }
})
```


### this variables
```html
<!--- Exsample --->
<div data-view="sample">
  <h1 data-sample-ref="title">Hello, world!</h1>
</div>
```
| id | value | ex |
|----|--------|------|
| section | HTMLElement | `<div data-view="sample"></div>` |
| refs | Record<string, HTMLElement> | this.refs.title ▼<br/>`<h1 data-sample-ref="title">Hello, world!</h1>` |
