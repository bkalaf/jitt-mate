export function getAssoc<T, K extends keyof T & string>(key: K, def: T[K] | undefined = undefined) {
    return function (obj: T): T[K] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.getOwnPropertyNames(obj).includes(key) ? obj[key] : (def as any);
    };
}
