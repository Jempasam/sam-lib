import { Observable } from '../Observable.js';
/** A set of function. */
export declare class OSource<T> extends Observable<T> {
    private parent;
    private observers;
    constructor(parent?: Observable<T> | undefined);
    /** Register an observer */
    register(observer: (event: T) => void): () => boolean;
    /** Unregister an observer */
    unregister(observer: (event: T) => void): void;
    /** Send a notification to the observers */
    notify(notification: T): void;
    private depth;
}
