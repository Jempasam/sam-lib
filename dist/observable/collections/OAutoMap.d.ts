import { OMap, OMapObservable } from './OMap.ts';
/**
 * A observable map that automaticcaly calculate his keys.
 * Can also automatically create his values from his keys when getted.
 * @template K The type of the keys
 * @template T The type of the values
 */
export declare class MOAutoMap<K, T> extends OMap<K, T> {
    private key_factory;
    private value_factory?;
    observable: OMapObservable<K, T>;
    content: Map<K, T>;
    constructor(key_factory: (value: T) => K, value_factory?: ((key: K) => T) | undefined, init?: Map<K, T>, parent?: OMapObservable<K, T>);
    /** Set or delete a value */
    set(value: T): void;
    /** Get a value or create it if it does not exist */
    get_or_create(key: K): T;
    /** Get a value */
    or_compute(key: K, computation: () => T): T;
    /** Delete a value if it exists */
    delete(key: K): void;
}
