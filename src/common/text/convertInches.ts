import { convertFraction } from './convertFraction';

export const convertInches = (value?: number, endingDefaultPrecision = 4) => {
    if (value == null) return undefined;
    const [left, right] = value.toFixed(4).split('.');
    if (right.split('').every((x) => x === '0')) return value.toFixed(0);
    return convertFraction(value, endingDefaultPrecision);
};

console.log(convertInches(7.5));
console.log(convertInches(7.6666));
console.log(convertInches(7.125));
console.log(convertInches(7.9286));
console.log(convertInches(7.8750));
console.log(convertInches(7.1666));
console.log(convertInches(7.1666));
console.log(convertInches(7.196, 4));
