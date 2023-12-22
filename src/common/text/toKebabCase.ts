import { charRange } from '../array/charRange';

export function toKebabCase(str: string) {
    function inner(todo: string[], current: string[] = [], accum: string[][] = []): string[][] {
        if (todo.length === 0) return [...accum, current];
        const [head, ...tail] = todo;
        if (predicate(head)) {
            return inner(tail, [head], [...accum, current]);
        }
        return inner(tail, [...current, head], accum);
    }
    const chars = str.split('');
    const predicate = (x: string) => charRange('A', 'Z').includes(x) || charRange('0', '9').includes(x);
    return inner(chars)
        .map((x) => x.join(''))
        .map((x) => x.toLowerCase())
        .join('-');
}
