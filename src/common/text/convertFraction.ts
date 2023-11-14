export const decimalData = [
    { value: 0.0625, numerator: 1, denominator: 16 },
    { value: 0.0714, numerator: 1, denominator: 14 },
    { value: 0.0833, numerator: 1, denominator: 12 },
    { value: 0.1, numerator: 1, denominator: 10 },
    { value: 0.125, numerator: 1, denominator: 8 },
    { value: 0.1666, numerator: 1, denominator: 6 },
    { value: 0.1667, numerator: 1, denominator: 6 },
    { value: 0.1875, numerator: 3, denominator: 16 },
    { value: 0.2, numerator: 1, denominator: 5 },
    { value: 0.2142, numerator: 3, denominator: 14 },
    { value: 0.2143, numerator: 3, denominator: 14 },
    { value: 0.25, numerator: 1, denominator: 4 },
    { value: 0.3, numerator: 3, denominator: 10 },
    { value: 0.3125, numerator: 5, denominator: 16 },
    { value: 0.3333, numerator: 1, denominator: 3 },
    { value: 0.3334, numerator: 1, denominator: 3 },
    { value: 0.3571, numerator: 5, denominator: 14 },
    { value: 0.375, numerator: 3, denominator: 8 },
    { value: 0.4, numerator: 2, denominator: 5 },
    { value: 0.4166, numerator: 5, denominator: 12 },
    { value: 0.4167, numerator: 5, denominator: 12 },
    { value: 0.4375, numerator: 7, denominator: 16 },
    { value: 0.5, numerator: 1, denominator: 2 },
    { value: 0.5625, numerator: 9, denominator: 16 },
    { value: 0.5833, numerator: 7, denominator: 12 },
    { value: 0.6, numerator: 3, denominator: 5 },
    { value: 0.625, numerator: 5, denominator: 8 },
    { value: 0.6428, numerator: 9, denominator: 14 },
    { value: 0.6429, numerator: 9, denominator: 14 },
    { value: 0.6666, numerator: 2, denominator: 3 },
    { value: 0.6667, numerator: 2, denominator: 3 },
    { value: 0.6875, numerator: 11, denominator: 16 },
    { value: 0.7, numerator: 7, denominator: 10 },
    { value: 0.75, numerator: 3, denominator: 4 },
    { value: 0.7857, numerator: 11, denominator: 14 },
    { value: 0.8, numerator: 4, denominator: 5 },
    { value: 0.8125, numerator: 13, denominator: 16 },
    { value: 0.8333, numerator: 5, denominator: 6 },
    { value: 0.8334, numerator: 5, denominator: 6 },
    { value: 0.875, numerator: 7, denominator: 8 },
    { value: 0.9, numerator: 9, denominator: 10 },
    { value: 0.9166, numerator: 11, denominator: 12 },
    { value: 0.9167, numerator: 11, denominator: 12 },
    { value: 0.9285, numerator: 13, denominator: 14 },
    { value: 0.9286, numerator: 13, denominator: 14 },
    { value: 0.9375, numerator: 15, denominator: 16 }
];

const values = decimalData.map((x) => x.value.toFixed(4));
const isConvertable = (n: string) => values.includes(n);

export function convertFraction(value?: number, precision = 2) {
    if (value == null) return undefined;
    const decimal = parseFloat(value.toFixed(precision)) - Math.floor(value);
    if (isConvertable(decimal.toFixed(precision))) {
        const integer = (value - decimal).toFixed(0);
        const data = decimalData.find((x) => x.value.toFixed(precision) === decimal.toFixed(precision)) ?? { value: 0, numerator: 0, denominator: 0 };
        return [integer, [data.numerator.toFixed(0), data.denominator.toFixed(0)].join('/')].join(' ');
    }
    return value.toFixed(precision);
}
