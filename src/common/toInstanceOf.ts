// eslint-disable-next-line @typescript-eslint/ban-types
export function toInstanceOf<T>(Ctor: Function) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (obj?: any): obj is T {
        return obj instanceof Ctor;
    };
}
