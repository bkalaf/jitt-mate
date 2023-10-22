import { range } from './range';


export function charRange(start: string, end: string) {
    return range(start.charCodeAt(0), end.charCodeAt(0)).map(x => String.fromCharCode(x));
}
