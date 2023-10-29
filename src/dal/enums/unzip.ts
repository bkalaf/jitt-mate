export function unzip<T, U>(arr: [T, U][], accumT: T[] = [], accumU: U[] = []): [T[], U[]] {
    if (arr.length === 0) return [accumT, accumU];
    const [[left, right], ...tail] = arr;
    return unzip(tail, [...accumT, left], [...accumU, right]);
}
