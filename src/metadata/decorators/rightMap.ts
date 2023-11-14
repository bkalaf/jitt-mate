
export function rightMap<T, U, V>(func: (...x: [T, U]) => U) {
    return <W>(f: (x: W) => U) => {
        return (...args: [T, W]) => func(args[0], f(args[1]))
    };
}
