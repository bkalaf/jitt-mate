// ///<reference path="./../../global.d.ts" />
import { charRange } from '../array/charRange';
import { distinct } from '../array/distinct';
import { composeR } from '../functions/composeR';

export function normalizeStringForFS(replacement: string) {
    return function (str: string) {
        function inner(toTest: string): string {
            return toTest.includes('--') ? inner(toTest.replaceAll('--', '-')) : toTest;
        }
        function inner2(toTest: string): string {
            return toTest.startsWith('-') ? inner2(toTest.substring(1)) : toTest;
        }
        function inner3(toTest: string): string {
            return toTest.endsWith('-') ? inner2(toTest.substring(0, toTest.length - 1)) : toTest;
        }
        const lower = charRange('a', 'z');
        const upper = charRange('A', 'Z');
        const digit = charRange('0', '9');
        const symbols = ['-', '_', '&', '@'];
        const validChars = [...lower, ...upper, ...digit, ...symbols];
        const distinctChars = distinct(str.toLowerCase().split(''));
        const invalidChars = distinctChars.filter(x => !validChars.includes(x));
        // console.log(`validChars`, JSON.stringify(validChars, null, '\t'))
        // console.log(`distinctChars`, JSON.stringify(distinctChars, null, '\t'));
        // console.log(`invalidChars`, JSON.stringify(invalidChars, null, '\t'));

        const result = invalidChars.map((target) => (s: string) => s.replaceAll(target, replacement)).reduce((pv, cv) => cv(pv), str.toLowerCase());
        const func = composeR(inner, inner2, inner3);
        return func(result);
    };
}

// console.log(normalizeStringForFS('-')('Hello World'))
// console.log(normalizeStringForFS('-')('-brandNameOne:'));
// console.log(normalizeStringForFS('-')('ziggy: zaggy!'));
// console.log(normalizeStringForFS('-')('H&M'));
// console.log(normalizeStringForFS('-')('GUESS'));
