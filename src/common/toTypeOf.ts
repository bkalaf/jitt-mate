export function toTypeOf<T>(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (obj?: any): obj is T {
        return obj != null ? typeof obj === name : false;
    };
}
