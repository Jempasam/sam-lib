import { FriendlyIterable } from '../../FriendlyIterable.js';
import { OSource } from '../source/OSource.js';
/**
 * A observable array
 */
export declare class OArrayObservable<T> {
    readonly on_add: OSource<{
        value: T;
        index: number;
    }>;
    readonly on_remove: OSource<{
        value: T;
        index: number;
    }>;
    constructor(parent: OArrayObservable<T> | undefined);
}
/**
 * A observable array
 */
export declare abstract class OArray<T> {
    observable: OArrayObservable<T>;
    protected content: T[];
    get length(): number;
    get(index: number): T;
    [Symbol.iterator](): ArrayIterator<T>;
    values(): FriendlyIterable<T>;
}
/**
 * A observable array
 */
export declare class MOArray<T> extends OArray<T> {
    constructor(init?: T[], parent?: OArrayObservable<T>);
    /** Remove the given number of elements at the given index and add the given values at the same index */
    splice(start: number, deleteCount: number, ...added: T[]): T[];
    /** Add the values at the end of the array */
    push(...added: T[]): void;
    /** Insert the value at the given index */
    insert(index: number, value: T): void;
    /** Remove the element at the given index */
    remove(index: number): T;
    /** Remove the last element */
    pop(): T;
}
