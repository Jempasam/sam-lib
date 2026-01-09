import { html } from "sam-lib";
import styleCss from "./test.css?url";

const Asserts = {

    test(condition: boolean, message: string){
        if(!condition) this.fail(message)
    },

    equals<T>(expected: T, actual: T, message?: string){
        this.test(expected === actual, message || `Expected ${expected} but got ${actual}`)
    },

    notEquals<T>(notExpected: T, actual: T, message?: string){
        this.test(notExpected !== actual, message || `Did not expect ${notExpected} but got ${actual}`)
    },

    throw(fn: () => void, message?: string){
        try{
            fn()
        } catch {
            throw this.fail(message || `Expected function to throw an error`)
        }
        this.test(false, message || `Expected function to throw an error`)
    },

    call(fn: () => boolean){
        const code = fn.toString();
        code
            .replace(/^function\s*\(\)\s*{/, '')
            .replace(/^()\s*=>\s*{/, '')
            .replace(/}$/, '');
        this.test(fn(), `'${code}' had failed`)
    },

    fail(message: string){
        throw new Error(message)
    },
}

function assertFn(condition: boolean, message: string){
    Asserts.test(condition, message)
}

Object.assign(assertFn, Asserts);

class TestGroup{

    private count = html.a`<div class="current">0</div>`

    private totalCount = html.a`<div class="total">0</div>`

    private resultCount = html.a`<div class="test_count">${this.count}${this.totalCount}</div>`
    
    private list = html.a`<ul class="test_list"></ul>`

    private current = 0

    private total = 0

    readonly element

    constructor(name: string){
        this.element = html.a`
            <div class=test_group>
                <h2>${name}</h2>
                ${this.resultCount}
                ${this.list}
            </div>
        `
    }

    test(name: string, fn: () => void){
        const error = (()=>{
            try{
                fn()
                return null
            }catch(e){
                console.error(e)
                return e as Error
            }
        })()

        this.total++
        if(!error) this.current++
        
        this.resultCount.classList.toggle("error", this.current<this.total)
        this.resultCount.classList.toggle("success", this.current>=this.total)
        this.count.textContent = ""+this.current
        this.totalCount.textContent = ""+this.total

        this.list.appendChild(html.a`
            <li>
                <h3>${name}</h3>
                <div class="test_result ${this.current<this.total ? 'error' : 'success'}">
                    ${error ? error!.message : 'Success'}
                </div>
            </li>
        `)
        return this
    }
}

export class TestDisplay{

    constructor(private context: HTMLElement){
        context.innerHTML = `
            <style>
                @import url(${styleCss});
            </style>
            <h1>Tests</h1>
        `
    }

    group(name: string): TestGroup{
        const group = new TestGroup(name)
        this.context.appendChild(group.element)
        return group
    }
}

export const assert = assertFn as (typeof Asserts)&(typeof assertFn)
