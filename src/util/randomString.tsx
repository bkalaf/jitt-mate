import { charRange } from '../common/array/charRange';
import { createFrom } from '../common/array/createFrom';


export function randomString(len = 12) {
    const upper = charRange('a', 'z');
    const lower = charRange('A', 'Z');
    const digit = charRange('0', '9');
    const chars = [...upper, ...lower, ...digit];
    const rands = createFrom(() => Math.random(), len);
    return rands.map((x) => chars[Math.floor(x * chars.length)]).join('');
}
