
export function runIf<T>(func: (x: T) => any) {
    return (value?: T | void) => {
        if (value == null) func(value as T);
    };
}
