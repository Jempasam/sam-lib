

export interface HtmlTemplateComponent{

    readonly element: Node

    setTemplateAttr(name: string, value: string): boolean
}

export function escapeHtml(unsafe: string)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Create a document fragment from a template string. With the following rules.
 * 
 * Most of the time :
 * - **undefined** and **null** values are ignored
 * - A **string** is inlined and html escaped
 * - A **{@link Node}** is inserted as is
 * - An **{@link Iterable}** is expanded
 * - An object with a {@link HtmlTemplateComponent#element} member, its element is inserted as is
 * - A **{@link Function}** is called and its result is processed according to these rules
 * - Other is stringified and treated as a **string**
 * 
 * When just after a "<" character (for element name) :
 * - **undefined** and **null** values are ignored, and the element is removed
 * - A **string** is inlined and html escaped
 * - A **{@link Element}** is inserted as is, the following attributes and children are transfered to it
 * - An object with a {@link HtmlTemplateComponent#element} member, its element treated like a {@link Element}
 * - An **{@link Iterable}** is expanded
 * - A **{@link Function}** is called and its result is processed according to these rules
 * If multiple element are placed, only the first element take the following childrens
 * 
 * When just after a "@" character (for special element value) in a element opening balise :
 * - **undefined** and **null** values are ignored
 * - An **{@link Iterable}** is expanded
 * - A **{@link Function}** is called with the element as argument, after the element is created.
 * - An **{@link Object}** will have its key-value pairs registred as event listeners on the element. A custom "init" event
 **/
export function html(strings: TemplateStringsArray, ...values: any): DocumentFragment {

    // All builder neededs
    let idCounter = 0
    let result = ""
    let after_load: Record<string, ((element:Element)=>void)[]> = {}

    function add_after_load(id:string, func:(element:Element)=>void){
        if(!(id in after_load))after_load[id]=[]
        after_load[id].push(func)
    }

    // Add a value to the current html code
    function putValue(value: any){
        // Ignore null and undefined
        if(value===null || value===undefined){}
        // Insert DOMNode
        else if(value instanceof Node){
            var id = `_sam_frament_target_${idCounter++}`
            result+=`<span ${id}=""></span>`
            add_after_load(id, it => it.replaceWith(value))
        }
        // Support of HtmlTemplateComponent 
        else if(typeof value === "object" && "element" in value){
            putValue(value.element)
        }
        // Insert string
        else if(typeof value === "string") result+=escapeHtml(value)
        // Expand iterables
        else if(typeof value[Symbol.iterator]==="function"){
            for(const v of value) putValue(v)
        }
        // Call functions
        else if (typeof value === "function")putValue(value())
        // To string and escape
        else result += escapeHtml(""+value)
    }

    // Add a value to the current html code, as element name
    // Call with the placeholder element that will be created in positon and then removed.
    function putElement(value: any, after_created:((element:Element)=>void)[]){
        // Ignore null and undefined
        if(value===null || value===undefined){}
        // Insert DOMNode before the element and copy classes and child to the first
        else if(value instanceof Element){
            after_created.push(placeholder=>{
                // Copy attributes
                for(let i=0; i<placeholder.attributes.length; i++){
                    const item = placeholder.attributes.item(i)!!
                    value.attributes.setNamedItem(item.cloneNode() as Attr)
                }
                // Move childs
                while(placeholder.firstChild) value.appendChild(placeholder.firstChild)
                // Put
                placeholder.before(value)
            })
        }
        // Support of HtmlTemplateComponent 
        else if(typeof value === "object" && "element" in value && value.element instanceof Element){
            const component = value as HtmlTemplateComponent
            const element = component.element as Element
            after_created.push(placeholder=>{
                // Copy attributes
                for(let i=0; i<placeholder.attributes.length; i++){
                    const item = placeholder.attributes.item(i)!!
                    if(!component.setTemplateAttr || !component.setTemplateAttr(item.name, item.value)){
                        element.attributes.setNamedItem(item.cloneNode() as Attr)
                    }
                }
                // Move childs
                while(placeholder.firstChild) element.appendChild(placeholder.firstChild)
                // Put
                placeholder.before(element)
            })
        }
        // string as element name
        else if(typeof value==="string") result += escapeHtml(value)
        // Expand iterables
        else if(typeof value[Symbol.iterator]==="function"){
            for(const v of value) putElement(v,after_created)
        }
        // Call functions
        else if (typeof value === "function") putElement(value(),after_created)
        // Throw exceptions if not a valid type
        else throw new Error("Invalid type to be placed as an element: "+typeof value)
    }

    // Add a value to the current html code, as a special value for an element.
    function putAt(value: any, after_created:((element:Element)=>void)[]){
        // Ignore null and undefined
        if(value===null || value===undefined){}
        // Expand iterables
        else if(typeof value[Symbol.iterator]==="function"){
            for(const v of value) putAt(v,after_created)
        }
        // Add a function as an init callback
        else if (typeof value === "function") after_created.push(value)
        // Add the members of a function dict as event handlers
        else if (typeof value === "object"){
            after_created.push(element=>{
                for(const [key, v] of Object.entries(value)){
                    if(typeof v==="function"){
                        if(key=="init") after_created.push(v as any)
                        else element.addEventListener(key, v as any)
                    }
                    else throw new Error("Invalid event listener for @ placeholder: "+key)
                }
            })
        }
        // Throw exceptions if not a valid type
        else throw new Error("Invalid type to be placed as an element: "+typeof value)
    }


    function treatStringPart(text:string){
        return text
            .replace("</>","</div>")
    }

    const elementCallbacks: Record<string, ((element:Element)=>void)[]> = {}
    try{
        // Now walks the values and treat the special placeholders
        for(let i=0; i<values.length; i++){
            // Element name interpolation
            if(strings[i].endsWith("<")){
                const id = `_sam_frament_to_remove_${idCounter++}`
                result+=strings[i]+`div ${id} `
                const after_created:((element:Element)=>void)[] = []
                elementCallbacks[id] = after_created
                putElement(values[i], after_created)
            }
            // Special value interpolation
            else if(strings[i].endsWith("@")){
                result += strings[i]
                const id = `_sam_frament_callback_${idCounter++}`
                result += ` ${id}="" `
                const after_created:((element:Element)=>void)[] = after_load[id] ?? []
                after_load[id] = after_created
                putAt(values[i], after_created)
            }
            // Normal value interpolation
            else{
                result += treatStringPart(strings[i])
                putValue(values[i])
            }
        }
        result += treatStringPart(strings[strings.length-1])
    }catch(e){
        const ctx = result.length<20 ? result : result.slice(-20,-1)
        throw new Error(`[${ctx}...] : ${e!=null && typeof e =="object" && 'message' in e ? e.message : e}`)
    }

    // Create the DOM
    const fragment = document.createRange().createContextualFragment(result)

    // Element value replacement
    for(const [id,functions] of Object.entries(elementCallbacks)){
        const placeholder = fragment.querySelector(`[${id}]`)!!
        placeholder.removeAttribute(id)
        for(const fn of functions) fn(placeholder)
        placeholder.remove()
    }

    // Callbacks
    for(const [id,functions] of Object.entries(after_load)){
        let element = fragment.querySelector(`[${id}]`)!!
        for(const fn of functions){
            if(!element.parentNode) element = fragment.getElementById(id)!!
            fn(element)
        }
        element.removeAttribute(id)
    }

    return fragment
}

/**
 * Work like {@link html} but return undefined if any of the value is undefined or null.
 * {@impo }
 * **/
html.opt= function(strings: TemplateStringsArray, ...values: any): DocumentFragment|undefined{
    if(values.includes(null) || values.includes(undefined))return undefined
    else return html(strings, ...values)
}

/**
 * Work like {@link html} but return undefined if all the values are undefined, null, or empty arrays.
 * The search for undefined, null, and empty arrays is NOT recursive.
 */
html.not_empty= function(strings: TemplateStringsArray, ...values: any): DocumentFragment|undefined{
    if(values.every((v:any)=>v===null || v===undefined || v?.length===0))return undefined
    else return html(strings, ...values)
}

/**
 * Work like {@link html} but return the first element child of the fragment.
 **/
html.a= function(strings: TemplateStringsArray, ...values: any): HTMLElement{
    return html(strings, ...values).firstElementChild as HTMLElement
}

/**
 * Create a html fragment from a list of elements.
 * @param elements 
 * @returns A document fragment containing the elements.
 */
export function fragment(...elements: Element[]): DocumentFragment {
    const frag= document.createDocumentFragment()
    for(const el of elements) frag.appendChild(el)
    return frag
}