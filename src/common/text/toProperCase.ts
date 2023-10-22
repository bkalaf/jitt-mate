import { charRange } from '../array/charRange';
import { capitalize } from './capitalize';
import { splitAt } from './splitAt';
import { splitWhen } from './splitWhen';

export const toProperCase = (str: string) => {
    return splitAt(x => x === ' ' || x === '-')(str);
};
export const toProperFromCamel = (str: string) => {
    return splitWhen(x => charRange('A', 'Z').includes(x))(str).map(x => capitalize(x.join(''))).join(' ')
}
