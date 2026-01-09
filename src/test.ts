import { html, HtmlTemplateComponent } from "./doc";
import { assert, TestDisplay } from "./test/test";

const GUI = new TestDisplay(document.body);

GUI.group("HTML")

.test("Simple string interpolation", ()=>{
    let element = html.a`<div class=${"poulet"}>${"Hello World"}</div>`

    assert(element.innerText=="Hello World", "String interpolation in content not working")
    assert(element.classList.contains("poulet"), "String interpolation in class not working")
})

.test("Nested elements", ()=>{
    let child = html.a`<span>Child</span>`
    let parent = html.a`<div>${child}</div>`
    
    assert(parent.firstChild===child, "Nested element is child of parent not working")

    let newparent = html.a`<section><div></div><div>${child}</div></section>`

    assert(newparent.children[1].firstChild===child, "Nested element is child of new parent not working")
})

.test("Element as tag name", ()=>{
    let title = html.a`<h1>Title</h1>`
    let body = html.a`<div>
        <h1>Body</h1>
        <${title} class=marble>Salut</>
    </div>`

    assert(body.children[1]===title, "Element used as tag name is child of parent not working")
    assert(title.classList.contains("marble"), "Attributes are not applied correctly")
})

.test("Iterable interpolation", ()=>{
    let items = ["One", "Two", "Three"]
    let list = html.a`<ul>
        ${items.map(i=>html.a`<li>${i}</li>`)}
    </ul>`
    assert(list.children.length==3, "All items in iterable are added as children")
    assert(list.children[0].textContent=="One", "First item is not correct")
    assert(list.children[1].textContent=="Two", "Second item is not correct")
    assert(list.children[2].textContent=="Three", "Third item is not correct")
})

.test("Event callbacks", ()=>{
    let clicked = false
    let button = html.a`<button @${{click: ()=>{clicked=true}}}>Click me</button>`
    assert(!clicked, "Button should not be clicked yet")
    button.click()
    assert(clicked, "Button should be clicked now")
})

.test("Init callbacks", ()=>{
    let element = null
    let button = html.a`<button @${(it:any)=>element=it}>Click me</button>`
    assert(element === button, "init callback not called with correct element")

    button = html.a`<button @${{init:(it:any)=>element=it}}>Click me</button>`
    assert(element === button, "init callback in object not called with correct element")
})

.test("Iterable elements as tag name", ()=>{
    let items = ["One", "Two", "Three"]
    let li = items.map(i=>html.a`<li>${i}</li>`)

    let list = html.a`<ul>
        <${li} color=red age=5> Salade</>
    </ul>`

    assert(list.children.length==3, "All items in iterable used as tag name are added as children")
    assert.equals(list.children[0].textContent, "One Salade")
    assert.equals(list.children[1].textContent, "Two")
    assert.equals(list.children[2].textContent, "Three")
    assert(list.children[0].getAttribute("color")=="red", "Attributes are not applied correctly")
    assert(list.children[1].getAttribute("age")=="5", "Attributes are not applied correctly")
    assert(list.children[2].getAttribute("color")=="red", "Attributes are not applied correctly")
})

.test("Optional template returns undefined", ()=>{
    let res = html.opt`<div>${undefined}</div>`
    assert(res===undefined, "html.opt should return undefined when any value is undefined")

    res = html.opt`<div>${"ok"}</div>`
    assert(res instanceof DocumentFragment, "html.opt should return a fragment when all values are defined")
    assert(res!!.firstElementChild!!.textContent=="ok", "html.opt should render content when defined")
})

.test("Not empty template skips empty interpolations", ()=>{
    let res = html.not_empty`<div>${undefined}${null}${[]}</div>`
    assert(res===undefined, "html.not_empty should return undefined when all values are empty")

    res = html.not_empty`<div>${[]}${"data"}</div>`
    assert(res instanceof DocumentFragment, "html.not_empty should return a fragment when some values are not empty")
    assert.equals(res!!.firstElementChild!!.textContent, "data", "html.not_empty should render non-empty content")
})

.test("HTML escaping in text interpolation", ()=>{
    let element = html.a`<div>${"<span>hack</span>&"}</div>`
    assert.equals(element.textContent, "<span>hack</span>&", "Interpolated text should be escaped")
    assert(element.querySelector("span")==null, "Escaped text should not create elements")
})

.test("Null and undefined in content are ignored", ()=>{
    let element = html.a`<div>${null}${undefined}ok${0}</div>`
    assert.equals(element.textContent, "ok0", "Null/undefined should not render, but other falsy values should")
})
.test("Null and undefined element placeholders are removed", ()=>{
    let section = html.a`<section><${null}></section>`
    assert.equals(section.children.length, 0, "Null element placeholder should be removed")

    section = html.a`<section><${undefined}></section>`
    assert.equals(section.children.length, 0, "Undefined element placeholder should be removed")
})
.test("Null and undefined @ placeholders are ignored", ()=>{
    let btn = html.a`<button @${null}>A</button>`
    assert(btn.getAttributeNames().every(n=>!n.startsWith("_sam_frament_callback_")), "Null @ placeholder should not leave marker attributes")

    btn = html.a`<button @${undefined}>B</button>`
    assert(btn.getAttributeNames().every(n=>!n.startsWith("_sam_frament_callback_")), "Undefined @ placeholder should not leave marker attributes")
})
.test("Function interpolation returns its result", ()=>{
    const element = html.a`<div>${()=>html.a`<span>Fn</span>`}</div>`
    assert.equals(element.children.length, 1, "Function result should be inserted")
    assert.equals(element.firstElementChild!!.tagName, "SPAN")
    assert.equals(element.firstElementChild!!.textContent, "Fn")
})
.test("@ placeholder iterable with null entries", ()=>{
    let clicked = 0
    const btn = html.a`<button @${[null, {click:()=>clicked++}]}>Tap</button>`
    btn.click()
    assert.equals(clicked, 1, "@ iterable should register event handlers and ignore nulls")
})
.test("HtmlTemplateComponent setTemplateAttr interception", ()=>{
    class Comp implements HtmlTemplateComponent{
        element = document.createElement("div")
        captured: Record<string,string> = {}
        setTemplateAttr(name: string, value: string){ this.captured[name]=value; return name==="data-capture" }
    }
    const c = new Comp()
    const el = html.a`<section><${c} class=hello data-capture=ok data-pass=yo>Child</section>`
    assert(el.firstElementChild===c.element, "Component element should replace placeholder")
    assert.equals(c.captured["data-capture"], "ok", "setTemplateAttr should intercept matching attributes")
    assert(!c.element.hasAttribute("data-capture"), "Intercepted attribute should not be set when handler returns true")
    assert.equals(c.element.getAttribute("data-pass"), "yo", "Non-intercepted attributes should be applied")
    assert(c.element.classList.contains("hello"), "Classes should be copied")
    assert.equals(c.element.textContent, "Child", "Children should be moved to component element")
})
.test("Only first element in tag placeholder receives children", ()=>{
    const items = [html.a`<article></article>`, html.a`<section></section>`]
    const container = html.a`<div><${items}>Hello</></div>`
    assert.equals(container.children.length, 2, "Both elements should be inserted")
    assert.equals(container.children[0].textContent, "Hello", "First element should receive children")
    assert.equals(container.children[1].textContent, "", "Following elements should not receive children")
})

