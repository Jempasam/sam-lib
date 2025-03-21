import { OSource } from './OSource.js';
export declare class CancellableOSource<T> {
    readonly before: OSource<T & {
        cancel: boolean;
    }>;
    readonly after: OSource<T>;
    readonly cancel: OSource<T>;
    /**
     * Notify the observer and return false if the notification was cancelled
     * @param value
     * @param action An action to perform if the notification is not cancelled and before the after event
     * @param postaction An action to perform after the after event
     */
    notify<Y>(value: T, action: ((cancel: () => void) => Y) | undefined, postaction: ((it: Y) => void) | undefined): boolean;
}
