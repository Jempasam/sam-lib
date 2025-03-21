import { OSource } from '../source/OSource.js';
export declare abstract class OValue<T> {
    protected _value: T;
    observable: OSource<{
        from: T;
        to: T;
    }>;
    /** Get the value */
    get(): T;
    /** Get the value */
    get value(): T;
}
export declare class MOValue<T> extends OValue<T> {
    constructor(value: T, parent?: OSource<{
        from: T;
        to: T;
    }>);
    /** Set the value */
    set(value: T): void;
    /** Set the value */
    set value(value: T);
    /** Get the value */
    get value(): T;
    /** Register a listener and call it immediately with the current value. */
    link(listener: (event: {
        from: T;
        to: T;
    }) => void): () => void;
}
