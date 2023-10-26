export function distinctBy<T>(predicate: (x: T) => (y: T) => boolean) {
    return function (arr: T[]) {
        function inner(todo: T[], accum: T[]): T[] {
            if (todo.length === 0) return accum;
            const [head, ...tail] = todo;
            if (accum.some(predicate(head))) return inner(tail, accum);
            return inner(tail, [...accum, head]);
        }
        return inner(arr, []);
    };
}
