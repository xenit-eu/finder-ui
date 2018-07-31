export function last<T>(immutableArray: ReadonlyArray<T>): T | undefined {
    return immutableArray[immutableArray.length - 1];
}
export function lastMust<T>(immutableArray: ReadonlyArray<T>): T {
    const element = immutableArray[immutableArray.length - 1];
    if (!element) {
        throw new Error("Exception must not be empty");
    }
    return element;
}
export function allButLast<T>(immutableArray: ReadonlyArray<T>) {
    return immutableArray.slice(0, immutableArray.length - 1);
}
export function allButFirst<T>(immutableArray: ReadonlyArray<T>) {
    return immutableArray.slice(1);
}

export function addElement<T>(immutableArray: ReadonlyArray<T>, element: T) {
    return immutableArray.concat([element]);
}
export function replaceLast<T>(immutableArray: ReadonlyArray<T>, element: T) {
    return addElement(allButLast(immutableArray), element);
}
export function replaceAt<T>(immutableArray: ReadonlyArray<T>, element: T, index: number) {
    return immutableArray.slice(0, index).concat([element]).concat(immutableArray.slice(index + 1, immutableArray.length));
}
export function removeAt<T>(immutableArray: ReadonlyArray<T>, index: number) {
    return immutableArray.slice(0, index).concat(immutableArray.slice(index + 1, immutableArray.length));
}
export function replaceOrRemoveAt<T>(immutableArray: ReadonlyArray<T>, element: T | null, index: number) {
    return element === null ? removeAt(immutableArray, index) : replaceAt(immutableArray, element, index);
}
