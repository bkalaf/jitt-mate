import { $css } from '../$css';
import { composeR } from '../../common/functions/composeR';

export const linkedColor = {
    red: 'red',
    orange: 'orange',
    yellow: 'yellow',
    green: 'green',
    blue: 'blue',
    purple: 'purple',
    pink: 'pink',
    brown: 'brown',
    gold: 'gold',
    silver: 'silver',
    white: 'white',
    black: 'black',
    grey: 'grey',
    burgundy: 'red',
    aqua: 'blue',
    cyan: 'blue',
    teal: 'blue',
    cream: 'white',
    tan: 'beige',
    navy: 'blue',
    beige: 'beige'
};

export const mercariColor = {
    black: 'itemColorId-1',
    grey: 'itemColorId-2',
    white: 'itemColorId-3',
    beige: 'itemColorId-4',
    red: 'itemColorId-5',
    pink: 'itemColorId-6',
    purple: 'itemColorId-7',
    blue: 'itemColorId-8',
    green: 'itemColorId-9',
    yellow: 'itemColorId-10',
    orange: 'itemColorId-11',
    brown: 'itemColorId-12',
    gold: 'itemColorId-13',
    silver: 'itemColorId-14'
};

export const getLinkedColor = (color?: keyof typeof linkedColor) => color != null ? linkedColor[color] as keyof typeof mercariColor : undefined;
export const getMercariColor = (color?: keyof typeof mercariColor) => color != null ? mercariColor[color] : undefined;
export const getColorSelector = composeR(getLinkedColor)(composeR(getMercariColor)((x?: string) => x != null ? $css.id(x) : undefined))

// console.log($getMercariColor('red'));
// console.log($getMercariColor('aqua'));

