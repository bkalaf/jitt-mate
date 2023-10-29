import { charRange } from '../common/array/charRange';


export function normalizeForHashTag(str: string) {
    if (str == null || str.length === 0) return undefined;
    const lower = charRange('a', 'z');
    const digit = charRange('0', '1');
    const valid = [...lower, ...digit];
    return str.toLowerCase().split('').filter(x => valid.includes(x)).join('');
}
