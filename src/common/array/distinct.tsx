
export function distinct<T>(arr: T[]) {
    function inner(todo: T[], accum: T[]): T[] {
        if (todo.length === 0) return accum;
        const [head, ...tail] = todo;
        if (accum.includes(head)) return inner(tail, accum);
        return inner(tail, [...accum, head]);
    }
    return inner(arr, []);
}
