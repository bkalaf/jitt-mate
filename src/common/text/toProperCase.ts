import { charRange } from '../array/charRange';
import { identity } from '../functions/identity';
import { capitalize } from './capitalize';
import { splitAt } from './splitAt';
import { splitWhen } from './splitWhen';

export const toProperCase = (str: string) => {
    return splitAt((x) => x === ' ' || x === '-')(str);
};
export const toProperFromCamel = (str: string) => {
    const s = str.startsWith('$') ? str.substring(1) : str;
    return splitWhen((x) => charRange('A', 'Z').includes(x), x => x, ' ')(s).split(' ')                     
        .map((x) => capitalize(x))
        .join(' ')
        .replaceAll('Sub ', 'Sub');
};
