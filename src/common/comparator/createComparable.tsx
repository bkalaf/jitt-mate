// eslint-disable-next-line @typescript-eslint/no-explicit-any


export function createComparable<T, U>(extractor: (x: T) => U, comp: (x: U, y: U) => CompareResult = (x: any, y: any) => x < y ? -1 : x > y ? 1 : 0): IComparable<T> {
    return (left: T) => (right: T): CompareResult => comp(extractor(left), extractor(right));
}
