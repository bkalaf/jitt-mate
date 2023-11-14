
export function chunkBy<T>(num: number) {
    function inner(todo: T[], current: T[] = [], accum: T[][] = []): T[][] {
        if (todo.length === 0) return [...accum, current];
        const [head, ...tail] = todo;
        if (current.length === num) return inner(tail, [head], [...accum, current]);
        return inner(tail, [...current, head], accum);
    }
    return inner;
}
