import { capitalize } from './capitalize';

export function splitWhen(predicate: (s: string) => boolean, postFunc = capitalize, joiner = '') {
    return (str: string) => {
        function inner(todo: string[], accum: string[][] = [], current: string[] = []): string[][] {
            if (todo.length === 0) return [...accum, current];
            const [head, ...tail] = todo;
            if (predicate(head)) {
                return inner(tail, [...accum, current], [head]);
            }
            return inner(tail, accum, [...current, head]);
        }
        return inner(str.split('')).map((x) => postFunc(x.join(''))).join(joiner);
    };
}
