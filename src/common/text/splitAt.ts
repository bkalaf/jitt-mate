import { capitalize } from './capitalize';

export function splitAt(predicate: (x: string) => boolean) {
    return function (str: string) {
        function inner(todo: string[], current: string[] = [], accum: string[][] = []) {
            if (todo.length === 0) return [...accum, current];
            const [head, ...tail] = todo;
            if (predicate(head)) {
                return inner(tail, [], [...accum, [...current, head]]);
            }
            return inner(tail, [...current, head], accum);
        }
        const chars = str.split('');
        const result = inner(chars);
        return result.map(x => capitalize(x.join(''))).join('');
    };
}
