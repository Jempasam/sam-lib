declare const Asserts: {
    test(condition: boolean, message: string): void;
    equals<T>(expected: T, actual: T, message?: string): void;
    notEquals<T>(notExpected: T, actual: T, message?: string): void;
    throw(fn: () => void, message?: string): void;
    call(fn: () => boolean): void;
    fail(message: string): never;
};
declare function assertFn(condition: boolean, message: string): void;
declare class TestGroup {
    private count;
    private totalCount;
    private resultCount;
    private list;
    private current;
    private total;
    readonly element: HTMLElement;
    constructor(name: string);
    test(name: string, fn: () => void): this;
}
export declare class TestDisplay {
    private context;
    constructor(context: HTMLElement);
    group(name: string): TestGroup;
}
export declare const assert: (typeof Asserts) & (typeof assertFn);
export {};
