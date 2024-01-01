const values = [
    'AA', 'AAA', 'C', 'D', 'CR2032', 'CR1632'
];

const colors = [
    'rose2',
    'cyan2',
    'yellow2',
    'lime2',
    'sky2',
    'purple2',
    'amber2',
    'pink2',
    'indigo2',
    'teal2',
    'orange2',
    'red2',
    'green2',
    'blue2',
    'slate2',
    'fuchsia2',
    'rose3',
    'cyan3',
    'yellow3',
    'lime3',
    'sky3',
    'purple3',
    'amber3',
    'pink3',
    'indigo3',
    'teal3',
    'orange3',
    'red3',
    'green3',
    'blue3',
    'slate3',
    'fuchsia3',
    'rose1',
    'cyan1',
    'yellow1',
    'lime1',
    'sky1',
    'purple1',
    'amber1',
    'pink1',
    'indigo1',
    'teal1',
    'orange1',
    'red1',
    'green1',
    'blue1',
    'slate1',
    'fuchsia1'
];

const result: Record<string, any> = {};

for (let index = 0; index < values.length; index++) {
    const element = values[index];
    result[element] = { key: element, text: element, color: colors[index] };
}

console.log(JSON.stringify(result, null, '\t'))