export function toTypeOf<T>(name: string) {
    return function (obj?: any): obj is T {
        return obj != null ? typeof obj === name : false;
    };
}
