export interface HtmlTemplateComponent {
    readonly element: Node;
    setTemplateAttr(name: string, value: string): boolean;
}
export declare function escapeHtml(unsafe: string): string;
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
export declare function html(strings: TemplateStringsArray, ...values: any): DocumentFragment;
export declare namespace html {
    var opt: (strings: TemplateStringsArray, ...values: any) => DocumentFragment | undefined;
    var not_empty: (strings: TemplateStringsArray, ...values: any) => DocumentFragment | undefined;
    var a: (strings: TemplateStringsArray, ...values: any) => HTMLElement;
}
/**
 * Create a html fragment from a list of elements.
 * @param elements
 * @returns A document fragment containing the elements.
 */
export declare function fragment(...elements: Element[]): DocumentFragment;
