import { Observable } from '../Observable.js';
export declare class OStartWith<T> extends Observable<T> {
    private decorated;
    private initalizer;
    constructor(decorated: Observable<T>, initalizer: (listener: (message: T) => void) => void);
    notify(event: T): void;
    register(observer: (event: T) => void): void;
    unregister(observer: (event: T) => void): void;
}
export declare function startWith<T>(decorated: Observable<T>, initalizer: (listener: (message: T) => void) => void): OStartWith<T>;
