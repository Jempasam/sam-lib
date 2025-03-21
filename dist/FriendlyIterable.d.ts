/**
 * A friendly iterable wrapper
 */
export declare class FriendlyIterable<T> {
    private iterable;
    constructor(iterable: Iterable<T>);
    [Symbol.iterator](): Iterator<T, any, any>;
    /** Performs the specified action for each element in an array. */
    forEach(callbackfn: (value: T, index: number) => void): void;
    /**
     * Returns the value of the first element of the iterator where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the iterator, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     */
    find(predicate: (value: T, index: number) => boolean): T | undefined;
    /**
     * Returns the index of the first element of the iterator where predicate is true, and -1
     * otherwise.
     * @param {} predicate find calls predicate once for each element of the iterator, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element index. Otherwise, find returns -1.
     */
    findIndex(predicate: (value: T, index: number) => boolean): number;
    /**
     * Returns the index of the first occurrence of a value in an iterator, or -1 if it is not present.
     * @param value The value to locate in the iterator.
     */
    indexOf(value: T): number;
    /**
     * Determines whether the specified callback function returns true for any element of an iterator.
     * @param predicate A function that accepts up to two arguments. some calls the predicate function for each element of the iterator until the predicate returns true, or until the end of the iterator.
     */
    some(predicate: (value: T, index: number) => boolean): boolean;
    /**
     * Determines whether all the members of an iterator satisfy the specified test.
     * @param predicate A function that accepts up to two arguments. every calls the predicate function for each element of the iterator until the predicate returns false, or until the end of the iterator.
     */
    every(predicate: (value: T, index: number) => boolean): boolean;
    /**
     * Returns a new iterator that contains the elements of the original iterator that satisfy the specified predicate.
     * @param mapper A function that accepts up to two arguments. filter calls the predicate function one time for each element of the iterator.
     */
    map<U>(mapper: (value: T, index: number) => U): U[];
    /**
     * Applies a function against an accumulator and each element in the iterator (from left to right) to reduce it to a single value.
     * @param callbackfn A function that accepts up to three arguments. The reduce method calls the callbackfn function one time for each element in the iterator.
     */
    reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number) => T): T;
    /**
     * Checks if the iterable contains the specified value.
     * @param value
     */
    includes(value: T): boolean;
}
