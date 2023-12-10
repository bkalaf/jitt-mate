import { convertFraction } from './convertFraction';

export const convertInches = (value?: number, endingDefaultPrecision = 4) => {
    if (value == null) return undefined;
    const [left, right] = value.toFixed(4).split('.');
    if (right.split('').every((x) => x === '0')) return value.toFixed(0);
    return convertFraction(value, endingDefaultPrecision);
};

