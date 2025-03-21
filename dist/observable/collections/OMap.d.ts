import { FriendlyIterable } from '../../FriendlyIterable.ts';
import { OSource } from '../source/OSource.ts';
import { OArray } from './OArray.ts';
/**
 * A observable array
 */
export declare class OMapObservable<K, T> {
    readonly on_change: OSource<{
        key: K;
        from: T | null;
        to: T | null;
    }>;
    constructor(parent?: OMapObservable<K, T>);
}
/**
 * A observable array
 * @template K The type of the keys
 * @template T The type of the values
 */
export declare abstract class OMap<K, T> {
    observable: OMapObservable<K, T>;
    protected content: Map<K, T>;
    /** Test if a key exists */
    has(key: K): boolean;
    /** Get a value */
    get(key: K): T | null;
    /** Get the entries */
    entries(): FriendlyIterable<[K, T]>;
    /** Get the entries */
    keys(): FriendlyIterable<K>;
    /** Get the values */
    values(): FriendlyIterable<T>;
    /**
     * Create an observable array that is automatically updated when this observable map is updated.
     * It try to keep the same ordering through each update.
     * It need to be disposed when not used anymore.
     */
    observable_values(): OArray<T> & {
        dispose(): void;
    };
}
/**
 * A observable array
 * @template K The type of the keys
 * @template T The type of the values
 */
export declare class MOMap<K, T> extends OMap<K, T> {
    constructor(init?: Map<K, T>, parent?: OMapObservable<K, T>);
    /**
     * Set or delete a value
     * @param value the value to set, or null to delete
     */
    set_or_delete(key: K, value: T | null): void;
    /**
     * Set or delete a value
     */
    set(key: K, value: T): void;
    /**
     * Delete a value if it exists
     */
    delete(key: K): void;
}
