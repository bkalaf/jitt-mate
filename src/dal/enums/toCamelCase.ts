import { charRange } from '../../common/array/charRange';
import { decapitalize } from '../../common/text/capitalize';
import { splitWhen } from '../../common/text/splitWhen';


export function toCamelCase(str: string) {
    const result = splitWhen(x => charRange('A', 'Z').includes(x), decapitalize, '-')(str);
    return result;
}
