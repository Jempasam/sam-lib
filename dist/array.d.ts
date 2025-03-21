export type FixedSizeArray<T, N extends number> = Omit<Array<T>, 'push' | 'pop' | 'shift' | 'unshift' | 'splice'> & {
    length: N;
};
