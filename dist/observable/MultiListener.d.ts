import { OSource } from './source/OSource.ts';
/**
 * An helper object for handling a listener registrer on multiple observables.
 */
export declare class MultiListener<T> {
    private sources;
    private listener;
    /**
     * Register multiple listeners and save them to be able to unregister them later.
     */
    constructor(sources: OSource<T>[], listener: (event: T) => void);
    /**
     * Unregister the listeners
     */
    free(): void;
}
/**
 * Register a listener on multiple observables.
 * Returns an object that can be used to unregister the listener.
 */
export declare function listen_all<T>(sources: OSource<T>[], listener: (event: T) => void): MultiListener<T>;
