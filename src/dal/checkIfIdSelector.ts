import { is } from './is';
import { $css } from './$css';


export function checkIfIdSelector(str?: string) {
    if (is.nullOrUndefined(str)) {
        return undefined;
    }
    return str.startsWith('#') ? str : $css.id(str);
}
