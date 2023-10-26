import { convertFraction } from './convertFraction';

export const convertInches = (value?: number) => {
    if (value == null) return undefined;
    const [left, right] = value.toFixed(2).split('.');
    if (right.split('').every((x) => x === '0')) return value.toFixed(0);
    return convertFraction(value, 2);
};
