import { endsWith } from '../endsWith';
import { flip } from '../flip';
import { not } from '../../common/not';
import { ifAny } from './ifAny';

export function isIn<T>(...arr: T[]) {
    return function (item: T) {
        return arr.includes(item);
    };
}
const isNotIn = function <T>(...arr: T[]) {
    return not(isIn(...arr));
};

const $endsWith = flip(endsWith);
export function pluralize(str: string) {
    switch (str) {
        case 'child':
            return 'children';
        case 'goose':
            return 'geese';
        case 'man':
        case 'men':
            return 'men';
        case 'woman':
        case 'women':
            return 'women';
        case 'tooth':
            return 'teeth';
        case 'foot':
            return 'feet';
        case 'mouse':
            return 'mice';
        case 'person':
            return 'people';
        case 'species':
            return 'species';
        case 'series':
            return 'series';
        default:
            if ($endsWith(str)('f') && isNotIn('chef', 'chief', 'belief', 'roof')(str)) {
                return [str.slice(0, str.length - 1), 'ves'].join('');
            }
            if ($endsWith(str)('fe')) {
                return [str.slice(0, str.length - 2), 'ves'].join('');
            }
            if ($endsWith(str)('y') && isNotIn('a', 'e', 'i', 'o', 'u')(str.substring(str.length - 2, str.length - 1))) {
                return [str.slice(0, str.length - 1), 'ies'].join('');
            }
            if ($endsWith(str)('y')) {
                return [str, 's'].join('');
            }
            if ($endsWith(str)('o') && isNotIn('photo', 'polo', 'poncho', 'chino', 'piano', 'stiletto', 'halo')(str)) {
                return [str, 'es'].join('');
            }
            if ($endsWith(str)('us') && isNotIn('bus')(str)) {
                return [str.substring(0, str.length - 2), 'i'].join('');
            }
            if ($endsWith(str)('is')) {
                return [str.substring(0, str.length - 2), 'es'].join('');
            }
            if ($endsWith(str)('on') && str !== 'location' && !str.endsWith('button')) {
                return [str.substring(0, str.length - 2), 'a'].join('');
            }
            if (ifAny('s', 'ss', 'sh', 'ch', 'x', 'z')($endsWith)(str)) {
                return str.endsWith('es') ? str : [str, 'es'].join('');
            }
            if (isIn('sheep', 'series', 'species', 'deer', 'fish', 'footwear', 'sleepwear')(str)) {
                return str;
            }
            return [str, 's'].join('');
    }
}


console.log(pluralize('sheep'));
console.log(pluralize('women'));
console.log(pluralize('clog'));
console.log(pluralize('shirt'));
console.log(pluralize('cloth'));
console.log(pluralize('boy'));
console.log(pluralize('tuxedo'));
console.log(pluralize('shoe'));
console.log(pluralize('accessory'))
console.log(pluralize('footwear'))
console.log(pluralize('dress'));
