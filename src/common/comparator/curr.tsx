
export function curr<T, U, V>(func: (x: T, y: U) => V) {
    return (args: [T, U]) => func(...args);
}
