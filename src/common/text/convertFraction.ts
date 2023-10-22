export const decimalData = [
    { "value": 0.0625, "numerator": 1, "denominator": 16, },
    { "value": 0.125, "numerator": 1, "denominator": 8, },
    { "value": 0.1875, "numerator": 3, "denominator": 16, },
    { "value": 0.25, "numerator": 1, "denominator": 4, },
    { "value": 0.3125, "numerator": 5, "denominator": 16, },
    { "value": 0.375, "numerator": 3, "denominator": 8, },
    { "value": 0.4375, "numerator": 7, "denominator": 16, },
    { "value": 0.5, "numerator": 1, "denominator": 2, },
    { "value": 0.5625, "numerator": 9, "denominator": 16, },
    { "value": 0.625, "numerator": 5, "denominator": 8, },
    { "value": 0.6875, "numerator": 11, "denominator": 16, },
    { "value": 0.75, "numerator": 3, "denominator": 4, },
    { "value": 0.8125, "numerator": 13, "denominator": 16, },
    { "value": 0.875, "numerator": 7, "denominator": 8, },
    { "value": 0.9375, "numerator": 15, "denominator": 16, }
];

const values = decimalData.map(x => x.value);
const isConvertable = (n: number) => values.includes(n);

export function convertFraction(value?: number, precision = 2) {
    if (value == null) return undefined;
    const decimal = value - Math.floor(value);
    if (isConvertable(decimal)) {
        const integer = (value - decimal).toFixed(0);
        const data = decimalData.find(x => x.value === decimal) ?? { value: 0, numerator: 0, denominator: 0 }
        return [integer, [data.numerator.toFixed(0), data.denominator.toFixed(0)].join('/')].join(' ');
    }
    return value.toFixed(precision);
}