export declare function escapeHtml(unsafe: string): string;
/**
 * Create a document fragment from a template string.
 * Node are inserted as is, other values are escaped as string.
 * Iterables are expanded.
 * Undefined and null values are ignored.
 * Function are called.
 *
 * If in a start balise of an element, a function placeholder is preceded by a "@" character,
 * the function will be called with the element as argument, after the element is created.
 *
 * If in a start balise of an element, a object placeholder is preceded by a "@" character,
 * their key-value of event name-function will be registred to the element. A custom "init" event
 * is called once directly after the element is created.
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
