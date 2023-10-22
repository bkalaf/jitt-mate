
export function partitionBy<T>(predicate: Predicate<T>) {
    function inner(todo: T[], left: T[] = [], right: T[] = []): [T[], T[]] {
        if (todo.length === 0) return [left, right];
        const [head, ...tail] = todo;
        if (predicate(head)) return inner(tail, [...left, head], right);
        return inner(tail, left, [...right, head]);
    }
    return (x: T[]) => inner(x);
}
